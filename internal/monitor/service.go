package monitor

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"strconv"
	"sync"
	"time"
	"uptime-sentinel/internal/db"
)

type Service struct {
	db         *db.Database
	urls       []string
	status     map[string]bool // true = up, false = down
	webhookURL string
	mu         sync.RWMutex
	ticker     *time.Ticker
	stopChan   chan struct{}
	logger     *slog.Logger
}

func NewService(database *db.Database, logger *slog.Logger, webhookURL string) *Service {
	return &Service{
		db:         database,
		urls:       []string{},
		status:     make(map[string]bool),
		webhookURL: webhookURL,
		logger:     logger,
		stopChan:   make(chan struct{}),
	}
}

func (s *Service) Start() error {
	existingURLs, err := s.db.GetMonitoredURLs()
	if err != nil {
		return err
	}

	s.mu.Lock()
	s.urls = existingURLs
	for _, u := range existingURLs {
		s.status[u] = true // Assume UP initially to prevent startup alert spam
	}
	s.mu.Unlock()

	pollInterval := 60
	if envVal := os.Getenv("POLL_INTERVAL"); envVal != "" {
		if val, err := strconv.Atoi(envVal); err == nil && val > 0 {
			pollInterval = val
		}
	}

	s.ticker = time.NewTicker(time.Duration(pollInterval) * time.Second)
	go s.monitorLoop()
	go s.pruneLoop()

	s.logger.Info("monitor service started", "url_count", len(existingURLs))
	return nil
}

func (s *Service) Stop() {
	if s.ticker != nil {
		s.ticker.Stop()
	}
	close(s.stopChan)
	s.logger.Info("monitor service stopped")
}

func (s *Service) AddURL(url string) {
	s.mu.Lock()

	for _, u := range s.urls {
		if u == url {
			s.mu.Unlock()
			return
		}
	}

	s.urls = append(s.urls, url)
	s.status[url] = true // Assume UP initially
	s.mu.Unlock()

	s.logger.Info("added url to monitor", "url", url)
	s.checkURL(url) // Immediate synchronous check
}

func (s *Service) RemoveURL(url string) {
	s.mu.Lock()
	defer s.mu.Unlock()

	var newURLs []string
	for _, u := range s.urls {
		if u != url {
			newURLs = append(newURLs, u)
		}
	}

	if len(newURLs) != len(s.urls) {
		s.urls = newURLs
		delete(s.status, url)
		s.logger.Info("removed url from monitor", "url", url)
	}
}

func (s *Service) monitorLoop() {
	s.checkAllURLs()

	for {
		select {
		case <-s.ticker.C:
			s.checkAllURLs()
		case <-s.stopChan:
			return
		}
	}
}

func (s *Service) pruneLoop() {
	pruneTicker := time.NewTicker(24 * time.Hour)
	defer pruneTicker.Stop()

	// Run once on startup
	s.pruneOldData()

	for {
		select {
		case <-pruneTicker.C:
			s.pruneOldData()
		case <-s.stopChan:
			return
		}
	}
}

func (s *Service) pruneOldData() {
	s.logger.Info("running database pruning for old checks")
	if err := s.db.DeleteOldChecks(365); err != nil {
		s.logger.Error("failed to prune old checks", "error", err)
	}
}

func (s *Service) checkAllURLs() {
	s.mu.RLock()
	urlsCopy := make([]string, len(s.urls))
	copy(urlsCopy, s.urls)
	s.mu.RUnlock()

	var wg sync.WaitGroup
	for _, url := range urlsCopy {
		wg.Add(1)
		go func(targetURL string) {
			defer wg.Done()
			s.checkURL(targetURL)
		}(url)
	}
	wg.Wait()
}

func (s *Service) checkURL(url string) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		s.logger.Error("failed to create request", "url", url, "error", err)
		return
	}

	start := time.Now()
	resp, err := http.DefaultClient.Do(req)
	latency := time.Since(start).Milliseconds()

	statusCode := 0
	isCurrentlyUp := false

	if err != nil {
		s.logger.Warn("check failed", "url", url, "error", err)
	} else {
		statusCode = resp.StatusCode
		resp.Body.Close()
		if statusCode >= 200 && statusCode < 400 {
			isCurrentlyUp = true
		}
	}

	s.mu.Lock()
	wasUp := s.status[url]
	s.status[url] = isCurrentlyUp
	s.mu.Unlock()

	if wasUp && !isCurrentlyUp {
		s.sendWebhookAlert(url, "DOWN", statusCode)
	} else if !wasUp && isCurrentlyUp {
		s.sendWebhookAlert(url, "UP", statusCode)
	}

	if err := s.db.InsertCheck(url, statusCode, latency); err != nil {
		s.logger.Error("failed to insert check", "url", url, "error", err)
		return
	}

	s.logger.Info("check completed", "url", url, "status", statusCode, "latency_ms", latency)
}

func (s *Service) sendWebhookAlert(url, state string, statusCode int) {
	if s.webhookURL == "" {
		return
	}

	payload := map[string]string{
		"content": fmt.Sprintf("🚨 **Monitor Alert** 🚨\nURL: %s\nState: **%s**\nStatus Code: %d", url, state, statusCode),
	}

	body, _ := json.Marshal(payload)
	req, err := http.NewRequest(http.MethodPost, s.webhookURL, bytes.NewBuffer(body))
	if err != nil {
		return
	}
	req.Header.Set("Content-Type", "application/json")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	req = req.WithContext(ctx)

	if _, err := http.DefaultClient.Do(req); err != nil {
		s.logger.Error("failed to send webhook alert", "error", err)
	}
}

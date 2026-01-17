package monitor

import (
	"context"
	"log/slog"
	"net/http"
	"sync"
	"time"
	"uptime-sentinel/internal/db"
)

type Service struct {
	db       *db.Database
	urls     []string
	mu       sync.RWMutex
	ticker   *time.Ticker
	stopChan chan struct{}
	logger   *slog.Logger
}

func NewService(database *db.Database, logger *slog.Logger) *Service {
	return &Service{
		db:       database,
		urls:     []string{},
		logger:   logger,
		stopChan: make(chan struct{}),
	}
}

func (s *Service) Start() error {
	existingURLs, err := s.db.GetMonitoredURLs()
	if err != nil {
		return err
	}

	s.mu.Lock()
	s.urls = existingURLs
	s.mu.Unlock()

	s.ticker = time.NewTicker(60 * time.Second)
	go s.monitorLoop()

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
	defer s.mu.Unlock()

	for _, u := range s.urls {
		if u == url {
			return
		}
	}

	s.urls = append(s.urls, url)
	s.logger.Info("added url to monitor", "url", url)
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
	if err != nil {
		s.logger.Warn("check failed", "url", url, "error", err)
	} else {
		statusCode = resp.StatusCode
		resp.Body.Close()
	}

	if err := s.db.InsertCheck(url, statusCode, latency); err != nil {
		s.logger.Error("failed to insert check", "url", url, "error", err)
		return
	}

	s.logger.Info("check completed", "url", url, "status", statusCode, "latency_ms", latency)
}

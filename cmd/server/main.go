package main

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"uptime-sentinel/internal/db"
	"uptime-sentinel/internal/monitor"
)

type Server struct {
	db      *db.Database
	monitor *monitor.Service
	logger  *slog.Logger
}

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

	database, err := db.NewDatabase("./uptime.db")
	if err != nil {
		logger.Error("failed to initialize database", "error", err)
		os.Exit(1)
	}
	defer database.Close()

	monitorService := monitor.NewService(database, logger)
	if err := monitorService.Start(); err != nil {
		logger.Error("failed to start monitor service", "error", err)
		os.Exit(1)
	}
	defer monitorService.Stop()

	server := &Server{
		db:      database,
		monitor: monitorService,
		logger:  logger,
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/api/status", server.handleGetStatus)
	mux.HandleFunc("/api/monitor", server.handleAddMonitor)

	handler := enableCORS(mux)

	httpServer := &http.Server{
		Addr:    ":8080",
		Handler: handler,
	}

	go func() {
		logger.Info("server starting", "addr", httpServer.Addr)
		if err := httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Error("server failed", "error", err)
			os.Exit(1)
		}
	}()

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
	<-sigChan

	logger.Info("shutting down server")
}

func (s *Server) handleGetStatus(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	checks, err := s.db.GetLatestChecks()
	if err != nil {
		s.logger.Error("failed to get checks", "error", err)
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(checks)
}

func (s *Server) handleAddMonitor(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var payload struct {
		URL string `json:"url"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if payload.URL == "" {
		http.Error(w, "url is required", http.StatusBadRequest)
		return
	}

	s.monitor.AddURL(payload.URL)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"status": "added"})
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

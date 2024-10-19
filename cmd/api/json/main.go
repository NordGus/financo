package main

import (
	"context"
	"financo/cmd/api/json/handlers/accounts"
	"financo/cmd/api/json/handlers/currencies"
	"financo/cmd/api/json/handlers/health"
	"financo/cmd/api/json/handlers/transactions"
	accounts_service "financo/server/accounts"
	"financo/server/my_journey"
	"financo/server/savings_goals"
	"financo/server/services/postgres_database"
	"financo/server/summary"
	transactions_service "financo/server/transactions"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

const (
	shutdownTimeout = 3 * time.Second
)

func main() {
	var (
		wg          = new(sync.WaitGroup)
		ctx, cancel = context.WithCancel(context.Background())

		pgService          = postgres_database.New()
		accountsBroker     = accounts_service.NewBroker(wg)
		transactionsBroker = transactions_service.NewBroker(wg)
	)

	defer func() {
		if err := accountsBroker.Shutdown(); err != nil {
			log.Printf("failed to shutdown accounts broker: %s\n", err)
		}
	}()

	defer func() {
		if err := transactionsBroker.Shutdown(); err != nil {
			log.Printf("failed to shutdown transactions broker: %s\n", err)
		}
	}()

	defer func() {
		if err := pgService.Close(); err != nil {
			log.Printf("failed to close database connections: %s\n", err)
		}
	}()

	wg.Add(1)
	go startHTTPServer(ctx, wg)

	// Listen for termination signals
	signalCh := make(chan os.Signal, 1)
	signal.Notify(signalCh, syscall.SIGINT, syscall.SIGTERM)

	<-signalCh

	log.Println("Gracefully shutting down services...")

	cancel()

	wg.Wait()

	log.Println("Shutdown complete.")
}

func startHTTPServer(ctx context.Context, wg *sync.WaitGroup) {
	defer wg.Done()

	router := chi.NewRouter()

	router.Use(middleware.RequestID)
	router.Use(middleware.Logger)

	router.Route("/accounts", accounts.Routes)
	router.Route("/currencies", currencies.Routes)
	router.Route("/health", health.Routes)
	router.Route("/my_journey", my_journey.Routes)
	router.Route("/savings_goals", savings_goals.Routes)
	router.Route("/summary", summary.Routes)
	router.Route("/transactions", transactions.Routes)

	// HTTP Server configuration
	server := &http.Server{
		Addr:              ":3000",
		Handler:           router,
		ReadHeaderTimeout: 500 * time.Millisecond,
		ReadTimeout:       1 * time.Second,
		WriteTimeout:      1 * time.Second,
	}

	// Start the HTTP server in a different goroutine
	go func() {
		log.Println("Starting HTTP server...")
		err := server.ListenAndServe()
		if err != nil && err != http.ErrServerClosed {
			log.Printf("HTTP server error: %s\n", err)
		}
	}()

	// Wait for the context to be canceled
	<-ctx.Done()

	// Shutdown the server gracefully
	log.Println("Shutting down HTTP server gracefully...")
	shutdownCtx, cancelShutdown := context.WithTimeout(context.Background(), shutdownTimeout)
	defer cancelShutdown()

	err := server.Shutdown(shutdownCtx)
	if err != nil {
		fmt.Printf("HTTP server shutdown error: %s\n", err)
	}

	log.Println("HTTP server stopped")
}

package main

import (
	"context"
	"financo/cmd/api/json/handlers/accounts"
	"financo/cmd/api/json/handlers/categories"
	"financo/cmd/api/json/handlers/currencies"
	"financo/cmd/api/json/handlers/graphs"
	"financo/cmd/api/json/handlers/health"
	"financo/cmd/api/json/handlers/my_journey"
	"financo/cmd/api/json/handlers/savings_goals"
	"financo/cmd/api/json/handlers/transactions"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"financo/services/in_memory_session_store"
	"financo/services/message_buses"
	"financo/services/postgresql_database"
	"financo/services/umbilical"

	"github.com/go-chi/chi/v5"
	chi_middleware "github.com/go-chi/chi/v5/middleware"
)

const (
	shutdownTimeout = 3 * time.Second
)

func main() {
	var (
		wg          = new(sync.WaitGroup)
		ctx, cancel = context.WithCancel(context.Background())

		pgDBService         = postgresql_database.New()
		sessionStore        = in_memory_session_store.New()
		umbilicalService    = umbilical.New()
		messageBusesService = message_buses.Initialize(wg)
	)

	defer func() {
		if err := pgDBService.Close(); err != nil {
			log.Printf("failed to close database connections: %s\n", err)
		}
	}()

	defer func() {
		if err := umbilicalService.Close(); err != nil {
			log.Printf("failed to close umbilical connection: %s\n", err)
		}
	}()

	defer func() {
		if err := sessionStore.Close(); err != nil {
			log.Printf("failed to close session store connection: %s\n", err)
		}
	}()

	defer func() {
		if err := messageBusesService.Close(); err != nil {
			log.Printf("failed to close message busses connection: %s\n", err)
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

	router.Use(chi_middleware.RequestID)
	router.Use(chi_middleware.RealIP)
	router.Use(chi_middleware.Logger)
	router.Use(chi_middleware.Recoverer)

	// protected routes
	router.Group(func(r chi.Router) {
		// r.Use(middleware.Session)

		r.Route("/accounts", accounts.Routes)
		r.Route("/categories", categories.Routes)
		r.Route("/currencies", currencies.Routes)
		r.Route("/graphs", graphs.Routes)
		r.Route("/health", health.Routes)
		r.Route("/my-journey", my_journey.Routes)
		r.Route("/savings-goals", savings_goals.Routes)
		r.Route("/transactions", transactions.Routes)
	})

	// HTTP Server configuration
	server := &http.Server{
		Addr:              ":3000",
		Handler:           router,
		ReadHeaderTimeout: 1 * time.Second,
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

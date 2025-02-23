package main

import (
	"context"
	"errors"
	"financo/cmd/web/api/json/handlers/accounts"
	"financo/cmd/web/api/json/handlers/categories"
	"financo/cmd/web/api/json/handlers/currencies"
	"financo/cmd/web/api/json/handlers/health"
	"financo/cmd/web/api/json/handlers/my_journey"
	"financo/cmd/web/api/json/handlers/savings_goals"
	"financo/cmd/web/api/json/handlers/transactions"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"financo/services/in_memory_session_store"
	"financo/services/message_buses"
	"financo/services/postgresql_database"
	"financo/services/shutdown"
	"financo/services/umbilical"

	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
)

const (
	shutdownTimeout = 3 * time.Second
)

func main() {
	shutdown.Arm()

	defer func() {
		if err := recover(); err != nil {
			shutdown.ExitWithErr(69, shutdown.NewPanic(err))
		}
	}()

	var (
		ctx, cancel = context.WithCancel(context.Background())

		_ = postgresql_database.New()
		_ = in_memory_session_store.New()
		_ = umbilical.New()
		_ = message_buses.New()
	)

	shutdown.AddTask(1)
	go startHTTPServer(ctx)

	// Listen for termination signals
	signalCh := make(chan os.Signal, 1)
	signal.Notify(signalCh, syscall.SIGINT, syscall.SIGTERM)

	<-signalCh

	log.Println("Gracefully shutting down services...")

	cancel()

	shutdown.WaitForTasksAndExit()
}

func startHTTPServer(ctx context.Context) {
	defer shutdown.TaskDone()

	router := chi.NewRouter()

	router.Use(
		chimiddleware.RequestID,
		chimiddleware.RealIP,
		chimiddleware.Logger,
		chimiddleware.Recoverer,
		chimiddleware.ContentCharset("UTF-8"),
		chimiddleware.Timeout(time.Second*30),
	)

	router.Route("/api", func(r chi.Router) {
		r.Use(chimiddleware.AllowContentType("application/json"))

		r.Group(func(public chi.Router) {
			//
		})

		r.Group(func(protected chi.Router) {
			// protected.Use(middleware.Session)

			protected.Route("/accounts", accounts.Routes)
			protected.Route("/categories", categories.Routes)
			protected.Route("/currencies", currencies.Routes)
			protected.Route("/health", health.Routes)
			protected.Route("/my-journey", my_journey.Routes)
			protected.Route("/savings-goals", savings_goals.Routes)
			protected.Route("/transactions", transactions.Routes)
		})
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
		if err != nil && !errors.Is(err, http.ErrServerClosed) {
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

package main

import (
	"financo/server/accounts"
	"financo/server/currency"
	"financo/server/health"
	"financo/server/services/postgres_database"
	"financo/server/summary"
	"financo/server/transactions"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	var (
		router    = chi.NewRouter()
		pgService = postgres_database.New()
	)

	defer func() {
		log.Println("closing database connections")

		err := pgService.Close()
		if err != nil {
			log.Println("something went wrong while closing database connections", err)
		}

		log.Println("database connections closed")
	}()

	router.Use(middleware.RequestID)
	router.Use(middleware.Logger)

	router.Route("/accounts", accounts.Routes)
	router.Route("/summary", summary.Routes)
	router.Route("/transactions", transactions.Routes)
	router.Route("/currencies", currency.Routes)
	router.Route("/health", health.Routes)

	err := http.ListenAndServe(":3000", router)
	if err != nil {
		log.Println("web service err", err)
		return
	}
}

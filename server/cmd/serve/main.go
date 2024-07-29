package main

import (
	"context"
	"financo/server/accounts"
	"financo/server/currency"
	"financo/server/summary"
	"financo/server/transactions"
	"financo/server/types/generic/context_key"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	ctx := context.Background()
	router := chi.NewRouter()

	dbConfig, err := pgxpool.ParseConfig(
		fmt.Sprintf(
			"%s pool_max_conns=%d pool_min_conns=%d",
			os.Getenv("DATABASE_URL"),
			10,
			3,
		),
	)
	if err != nil {
		log.Println("failed to parsed db config", err)
		return
	}

	dbConn, err := pgxpool.NewWithConfig(ctx, dbConfig)
	if err != nil {
		log.Println("failed to start db connection pool", err)
		return
	}
	defer func() {
		log.Println("closing database connections")
		dbConn.Close()
		log.Println("database connections closed")
	}()

	router.Use(middleware.RequestID)
	router.Use(middleware.Logger)
	router.Use(DatabaseCtx(dbConn))

	router.Route("/accounts", accounts.Routes)
	router.Route("/summary", summary.Routes)
	router.Route("/transactions", transactions.Routes)
	router.Route("/currencies", currency.Routes)

	err = http.ListenAndServe(":3000", router)
	if err != nil {
		log.Println("web service err", err)
		return
	}
}

func DatabaseCtx(pool *pgxpool.Pool) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			conn, err := pool.Acquire(r.Context())
			if err != nil {
				http.Error(
					w,
					http.StatusText(http.StatusInternalServerError),
					http.StatusInternalServerError,
				)
				return
			}
			defer conn.Release()

			ctx := context.WithValue(r.Context(), context_key.DB, conn)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

package accounts

import (
	"financo/server/accounts/http/handlers"
	"financo/server/accounts/http/middleware"

	"github.com/go-chi/chi/v5"
)

func Routes(r chi.Router) {
	r.Get("/", handlers.List)

	r.Route("/{accountID}", func(r chi.Router) {
		r.Use(middleware.GetAccount, middleware.GetChildren)
		r.Get("/", handlers.Show)
	})
}

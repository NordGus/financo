package accounts

import (
	"financo/server/accounts/http/handlers"
	"financo/server/accounts/http/middleware"

	"github.com/go-chi/chi/v5"
)

func Routes(r chi.Router) {
	r.Get("/", handlers.List)
	r.Post("/", handlers.Create)

	r.Route("/{accountID}", func(r chi.Router) {
		r.With(middleware.GetAccount, middleware.GetChildren).Get("/", handlers.Show)
		r.Delete("/", handlers.Destroy)
		r.Put("/", handlers.Update)
	})
}

package accounts

import (
	"financo/server/accounts/http/handlers"

	"github.com/go-chi/chi/v5"
)

func Routes(r chi.Router) {
	r.Get("/", handlers.List)
	r.Post("/", handlers.Create)

	r.Get("/select", handlers.Select)

	r.Route("/{accountID}", func(r chi.Router) {
		r.Get("/", handlers.Show)
		r.Delete("/", handlers.Destroy)
		r.Put("/", handlers.Update)
	})
}

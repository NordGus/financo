package transactions

import (
	"financo/server/transactions/http/handlers"

	"github.com/go-chi/chi/v5"
)

func Routes(r chi.Router) {
	r.Get("/", handlers.List)
	r.Post("/", handlers.Create)
	r.Get("/for_account/{accountID}", handlers.ListForAccount)

	r.Route("/pending", func(r chi.Router) {
		r.Get("/", handlers.Pending)
		r.Get("/for_account/{accountID}", handlers.PendingForAccount)
	})

	r.Route("/{id}", func(r chi.Router) {
		r.Delete("/", handlers.Destroy)
	})
}

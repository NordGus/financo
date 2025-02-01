package transactions

import (
	"financo/cmd/api/json/handlers/transactions/executed_handler"

	"github.com/go-chi/chi/v5"
)

func Routes(r chi.Router) {
	r.Get("/", executed_handler.HandlerFunc)
	// r.Post("/", create)

	// r.Get("/pending", pending)

	// r.Route("/{id}", func(r chi.Router) {
	// 	r.Delete("/", destroy)
	// 	r.Put("/", Update)
	// })

	// r.Route("/for_account", for_account.Routes)
}

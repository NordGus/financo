package transactions

import (
	"financo/cmd/api/json/handlers/transactions/for_account"

	"github.com/go-chi/chi/v5"
)

const (
	executedFromKey  = "executedFrom"
	executedUntilKey = "executedUntil"
	accountKey       = "account"
	categoryKey      = "category"
)

func Routes(r chi.Router) {
	r.Get("/", index)
	r.Post("/", create)

	r.Get("/pending", pending)

	r.Route("/{id}", func(r chi.Router) {
		r.Delete("/", destroy)
		r.Put("/", Update)
	})

	r.Route("/for_account", for_account.Routes)
}

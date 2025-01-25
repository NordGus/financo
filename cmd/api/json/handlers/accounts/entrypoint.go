package accounts

import (
	"financo/cmd/api/json/handlers/accounts/list_handler"

	"github.com/go-chi/chi/v5"
)

func Routes(r chi.Router) {
	r.Get("/", list_handler.HandlerFunc)
	r.Post("/", create)

	r.Route("/{id}", func(r chi.Router) {
		r.Delete("/", destroy)
		r.Put("/", update)
		r.Patch("/archive", archive)
		r.Patch("/unarchive", unarchive)
	})
}

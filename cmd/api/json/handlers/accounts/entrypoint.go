package accounts

import (
	"github.com/go-chi/chi/v5"
)

func Routes(r chi.Router) {
	r.Get("/", index)
	r.Post("/", create)

	r.Get("/select", forSelect)

	r.Route("/{id}", func(r chi.Router) {
		r.Get("/", show)
		r.Delete("/", destroy)
		r.Put("/", update)
	})
}

package categories

import (
	"financo/cmd/api/json/handlers/categories/create_child_handler"
	"financo/cmd/api/json/handlers/categories/list_handler"

	"github.com/go-chi/chi/v5"
)

func Routes(r chi.Router) {
	r.Get("/", list_handler.HandlerFunc)
	r.Post("/", create)

	r.Route("/{id}", func(cat chi.Router) {
		cat.Delete("/", destroy)
		cat.Put("/", update)
		cat.Patch("/archive", archive)
		cat.Patch("/unarchive", unarchive)

		cat.Route("/children", func(children chi.Router) {
			children.Post("/", create_child_handler.HandlerFunc)

			children.Route("/{childId}", func(child chi.Router) {

			})
		})
	})
}

package categories

import (
	"financo/cmd/api/json/handlers/categories/archive_child_handler"
	"financo/cmd/api/json/handlers/categories/archive_handler"
	"financo/cmd/api/json/handlers/categories/create_child_handler"
	"financo/cmd/api/json/handlers/categories/create_handler"
	"financo/cmd/api/json/handlers/categories/destroy_child_handler"
	"financo/cmd/api/json/handlers/categories/destroy_handler"
	"financo/cmd/api/json/handlers/categories/list_handler"
	"financo/cmd/api/json/handlers/categories/unarchive_child_handler"
	"financo/cmd/api/json/handlers/categories/unarchive_handler"
	"financo/cmd/api/json/handlers/categories/update_child_handler"
	"financo/cmd/api/json/handlers/categories/update_handler"

	"github.com/go-chi/chi/v5"
)

func Routes(r chi.Router) {
	r.Get("/", list_handler.HandlerFunc)
	r.Post("/", create_handler.HandlerFunc)

	r.Route("/{id}", func(cat chi.Router) {
		cat.Delete("/", destroy_handler.HandlerFunc)
		cat.Put("/", update_handler.HandlerFunc)
		cat.Patch("/archive", archive_handler.HandlerFunc)
		cat.Patch("/unarchive", unarchive_handler.HandlerFunc)

		cat.Route("/children", func(children chi.Router) {
			children.Post("/", create_child_handler.HandlerFunc)

			children.Route("/{childId}", func(child chi.Router) {
				child.Delete("/", destroy_child_handler.HandlerFunc)
				child.Put("/", update_child_handler.HandlerFunc)
				child.Patch("/archive", archive_child_handler.HandlerFunc)
				cat.Patch("/unarchive", unarchive_child_handler.HandlerFunc)
			})
		})
	})
}

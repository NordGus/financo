package categories

import (
	"financo/cmd/web/api/json/handlers/categories/archive_handler"
	"financo/cmd/web/api/json/handlers/categories/create_handler"
	"financo/cmd/web/api/json/handlers/categories/destroy_handler"
	"financo/cmd/web/api/json/handlers/categories/list_handler"
	"financo/cmd/web/api/json/handlers/categories/show_handler"
	"financo/cmd/web/api/json/handlers/categories/unarchive_handler"
	"financo/cmd/web/api/json/handlers/categories/update_handler"

	"github.com/go-chi/chi/v5"
)

func Routes(r chi.Router) {
	r.Get("/", list_handler.HandlerFunc)
	r.Post("/", create_handler.HandlerFunc)

	r.Route("/{id}", func(category chi.Router) {
		category.Get("/", show_handler.HandlerFunc)
		category.Delete("/", destroy_handler.HandlerFunc)
		category.Put("/", update_handler.HandlerFunc)
		category.Patch("/archive", archive_handler.HandlerFunc)
		category.Patch("/unarchive", unarchive_handler.HandlerFunc)
	})
}

package accounts

import (
	"financo/cmd/web/api/json/handlers/accounts/archive_handler"
	"financo/cmd/web/api/json/handlers/accounts/create_handler"
	"financo/cmd/web/api/json/handlers/accounts/destroy_handler"
	"financo/cmd/web/api/json/handlers/accounts/list_handler"
	"financo/cmd/web/api/json/handlers/accounts/unarchive_handler"
	"financo/cmd/web/api/json/handlers/accounts/update_handler"

	"github.com/go-chi/chi/v5"
)

func Routes(r chi.Router) {
	r.Get("/", list_handler.HandlerFunc)
	r.Post("/", create_handler.HandlerFunc)

	r.Route("/{id}", func(r chi.Router) {
		r.Delete("/", destroy_handler.HandlerFunc)
		r.Put("/", update_handler.HandlerFunc)
		r.Patch("/archive", archive_handler.HandlerFunc)
		r.Patch("/unarchive", unarchive_handler.HandlerFunc)
	})
}

package accounts

import (
	"financo/cmd/web/api/json/handlers/accounts/archive_handler"
	"financo/cmd/web/api/json/handlers/accounts/create_handler"
	"financo/cmd/web/api/json/handlers/accounts/destroy_handler"
	"financo/cmd/web/api/json/handlers/accounts/list_handler"
	"financo/cmd/web/api/json/handlers/accounts/show_handler"
	"financo/cmd/web/api/json/handlers/accounts/unarchive_handler"
	"financo/cmd/web/api/json/handlers/accounts/update_handler"

	"github.com/go-chi/chi/v5"
)

func Routes(r chi.Router) {
	r.Get("/", list_handler.HandlerFunc)
	r.Post("/", create_handler.HandlerFunc)

	r.Route("/{id}", func(account chi.Router) {
		account.Get("/", show_handler.HandlerFunc)
		account.Delete("/", destroy_handler.HandlerFunc)
		account.Put("/", update_handler.HandlerFunc)
		account.Patch("/archive", archive_handler.HandlerFunc)
		account.Patch("/unarchive", unarchive_handler.HandlerFunc)
	})
}

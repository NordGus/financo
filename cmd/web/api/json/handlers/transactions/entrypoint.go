package transactions

import (
	"financo/cmd/web/api/json/handlers/transactions/accounts_handler"
	"financo/cmd/web/api/json/handlers/transactions/executed_handler"

	"github.com/go-chi/chi/v5"
)

func Routes(r chi.Router) {
	r.Get("/", executed_handler.HandlerFunc)
	r.Get("/accounts", accounts_handler.HandlerFunc)
}

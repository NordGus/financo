package transactions

import (
	"financo/server/transactions/http/handlers"

	"github.com/go-chi/chi/v5"
)

func Routes(r chi.Router) {
	r.Get("/", handlers.List)
	r.Get("/pending", handlers.Pending)
}

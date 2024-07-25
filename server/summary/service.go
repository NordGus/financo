package summary

import (
	"financo/server/summary/http/handlers"

	"github.com/go-chi/chi/v5"
)

func Routes(r chi.Router) {
	r.Get("/capital", handlers.Capital)
	r.Get("/debts", handlers.Debts)
	r.Get("/total", handlers.NetWorth)
}

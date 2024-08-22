package summary

import (
	"financo/server/summary/http/handlers"

	"github.com/go-chi/chi/v5"
)

func Routes(r chi.Router) {
	r.Get("/capital", handlers.Capital)
	r.Get("/debts", handlers.Debts)
	r.Get("/net_worth", handlers.NetWorth)
	r.Get("/available_credit", handlers.AvailableCredit)

	r.Route("/for_account/{id}", func(r chi.Router) {
		r.Get("/balance", handlers.BalanceForAccount)
	})
}

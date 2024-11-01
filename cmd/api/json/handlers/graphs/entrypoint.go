package graphs

import (
	"financo/cmd/api/json/handlers/graphs/for_account"

	"github.com/go-chi/chi/v5"
)

func Routes(r chi.Router) {
	r.Get("/capital", Capital)
	r.Get("/debts", Debts)
	r.Get("/net-worth", NetWorth)
	r.Get("/available-credit", AvailableCredit)

	r.Route("/for-account", for_account.Routes)
}

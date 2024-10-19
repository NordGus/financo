package summaries

import (
	"financo/cmd/api/json/handlers/summaries/for_account"

	"github.com/go-chi/chi/v5"
)

func Routes(r chi.Router) {
	r.Get("/capital", Capital)
	r.Get("/debts", Debts)
	r.Get("/net_worth", NetWorth)
	r.Get("/available_credit", AvailableCredit)

	r.Route("/for_account", for_account.Routes)
}

package summaries

import (
	"financo/cmd/api/json/handlers/summaries/for_account"

	"github.com/go-chi/chi/v5"
)

func Routes(r chi.Router) {
	r.Route("/for_account", for_account.Routes)
}

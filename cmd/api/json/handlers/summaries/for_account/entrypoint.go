package for_account

import "github.com/go-chi/chi/v5"

func Routes(r chi.Router) {
	r.Route("/{id}", func(r chi.Router) {
		r.Get("/balance", balance)
		r.Get("/daily_balance", daily)
		r.Get("/paid", debt)
	})
}

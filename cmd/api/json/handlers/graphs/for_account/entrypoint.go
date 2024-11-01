package for_account

import "github.com/go-chi/chi/v5"

func Routes(r chi.Router) {
	r.Route("/{id}", func(r chi.Router) {
		r.Get("/balance", Balance)
		r.Get("/daily-balance", Daily)
		r.Get("/debt", Debt)
	})
}

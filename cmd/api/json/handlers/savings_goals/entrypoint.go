package savings_goals

import "github.com/go-chi/chi/v5"

func Routes(r chi.Router) {
	r.Post("/", Create)

	r.Get("/active", Active)
	r.Patch("/reorder", Reorder)

	r.Route("/{id}", func(r chi.Router) {
		// r.Delete("/", Destroy)
		r.Put("/", Update)
	})
}

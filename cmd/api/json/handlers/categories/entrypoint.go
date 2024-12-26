package categories

import "github.com/go-chi/chi/v5"

func Routes(r chi.Router) {
	r.Get("/", index)
	r.Post("/", create)

	r.Route("/{id}", func(r chi.Router) {
		// 	r.Delete("/", destroy)
		// 	r.Put("/", update)
		r.Patch("/archive", archive)
		r.Patch("/unarchive", unarchive)
	})
}

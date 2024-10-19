package my_journey

import "github.com/go-chi/chi/v5"

func Routes(r chi.Router) {
	r.Get("/achievements", achievements)
}

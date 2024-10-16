package my_journey

import (
	"financo/server/my_journey/http/handlers"

	"github.com/go-chi/chi/v5"
)

func Routes(r chi.Router) {
	r.Get("/achieved", handlers.Achieved)
}

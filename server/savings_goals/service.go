package savings_goals

import (
	"financo/server/savings_goals/http/handlers"

	"github.com/go-chi/chi/v5"
)

func Routes(r chi.Router) {
	r.Get("/active", handlers.ListActive)
}

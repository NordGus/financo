package savings_goals

import (
	"financo/cmd/api/json/handlers/savings_goals/create_handler"
	"financo/cmd/api/json/handlers/savings_goals/delete_handler"
	"financo/cmd/api/json/handlers/savings_goals/mark_as_achieved_handler"
	"financo/cmd/api/json/handlers/savings_goals/update_handler"

	"github.com/go-chi/chi/v5"
)

func Routes(r chi.Router) {
	r.Post("/", create_handler.HandlerFunc)

	r.Get("/active", Active)
	r.Patch("/reorder", Reorder)

	r.Route("/{id}", func(r chi.Router) {
		r.Delete("/", delete_handler.HandlerFunc)
		r.Put("/", update_handler.HandlerFunc)
		r.Patch("/mark-as-achieved", mark_as_achieved_handler.HandlerFunc)
	})
}

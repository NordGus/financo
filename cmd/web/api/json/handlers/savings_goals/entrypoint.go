package savings_goals

import (
	"financo/cmd/web/api/json/handlers/savings_goals/create_handler"
	"financo/cmd/web/api/json/handlers/savings_goals/delete_handler"
	"financo/cmd/web/api/json/handlers/savings_goals/list_handler"
	"financo/cmd/web/api/json/handlers/savings_goals/mark_as_achieved_handler"
	"financo/cmd/web/api/json/handlers/savings_goals/reorder_handler"
	"financo/cmd/web/api/json/handlers/savings_goals/show_handler"
	"financo/cmd/web/api/json/handlers/savings_goals/update_handler"

	"github.com/go-chi/chi/v5"
)

func Routes(r chi.Router) {
	r.Get("/", list_handler.HandlerFunc)
	r.Post("/", create_handler.HandlerFunc)
	r.Put("/reorder", reorder_handler.HandlerFunc)

	r.Route("/{id}", func(goal chi.Router) {
		goal.Get("/", show_handler.HandlerFunc)
		goal.Delete("/", delete_handler.HandlerFunc)
		goal.Put("/", update_handler.HandlerFunc)
		goal.Patch("/mark-as-achieved", mark_as_achieved_handler.HandlerFunc)
	})
}

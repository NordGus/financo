// Package trophy_room contains the API to interact with the trophy room feature
// of the achievement system
package trophy_room

import (
	"financo/cmd/web/api/json/handlers/trophy_room/timeline_handler"

	"github.com/go-chi/chi/v5"
)

func Routes(r chi.Router) {
	r.Get("/timeline", timeline_handler.HandleFunc)
}

package health

import (
	"financo/server/health/http/handlers"

	"github.com/go-chi/chi/v5"
)

func Routes(r chi.Router) {
	r.Get("/ping", handlers.Ping)
	r.Get("/database", handlers.Database)
}

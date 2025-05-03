package files

import (
	"financo/cmd/web/files/root_handler"
	"time"

	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
)

func Routes(r chi.Router) {
	r.Use(chimiddleware.Timeout(time.Second * 30))

	r.Mount("/", root_handler.HandlerFunc())
}

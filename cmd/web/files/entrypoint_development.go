//go:build development

package files

import (
	"financo/cmd/web/files/root_handler"
	"github.com/go-chi/chi/v5"
)

func Routes(r chi.Router) {
	r.Mount("/", root_handler.HandlerFunc())
}

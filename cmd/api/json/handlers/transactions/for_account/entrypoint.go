package for_account

import "github.com/go-chi/chi/v5"

const (
	executedFromKey  = "executedFrom"
	executedUntilKey = "executedUntil"
	accountKey       = "account"
	categoryKey      = "category"
)

func Routes(r chi.Router) {
	r.Route("/{id}", func(r chi.Router) {
		r.Get("/", index)
		r.Get("/pending", pending)
	})
}

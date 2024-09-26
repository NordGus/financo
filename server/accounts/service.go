package accounts

import (
	"context"
	"financo/server/accounts/brokers"
	"financo/server/accounts/http/handlers"
	"sync"

	"github.com/go-chi/chi/v5"
)

// NewBroker returns the service's message [brokers.Broker]. If no instance has
// being memoize yet the [*sync.WaitGroup] is required, please do this on
// program startup. If the instance is already memoized, pass nil as
// [*sync.WaitGroup].
func NewBroker(ctx context.Context, wg *sync.WaitGroup) brokers.Broker {
	return brokers.New(ctx, wg)
}

func Routes(r chi.Router) {
	r.Get("/", handlers.List)
	r.Post("/", handlers.Create)

	r.Get("/select", handlers.Select)

	r.Route("/{id}", func(r chi.Router) {
		r.Get("/", handlers.Show)
		r.Delete("/", handlers.Destroy)
		r.Put("/", handlers.Update)
	})
}

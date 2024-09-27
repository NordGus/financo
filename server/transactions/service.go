package transactions

import (
	"financo/server/transactions/brokers"
	"financo/server/transactions/http/handlers"
	"sync"

	"github.com/go-chi/chi/v5"
)

// NewBroker returns the service's message [brokers.Broker]. If no instance has
// being memoize yet the [*sync.WaitGroup] is required, please do this on
// program startup. If the instance is already memoized, pass nil as
// [*sync.WaitGroup].
func NewBroker(wg *sync.WaitGroup) brokers.Broker {
	return brokers.New(wg)
}

func Routes(r chi.Router) {
	r.Get("/", handlers.List)
	r.Post("/", handlers.Create)
	r.Get("/for_account/{accountID}", handlers.ListForAccount)

	r.Route("/pending", func(r chi.Router) {
		r.Get("/", handlers.Pending)
		r.Get("/for_account/{accountID}", handlers.PendingForAccount)
	})

	r.Route("/{id}", func(r chi.Router) {
		r.Delete("/", handlers.Destroy)
		r.Put("/", handlers.Update)
	})
}

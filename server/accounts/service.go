package accounts

import (
	"financo/server/accounts/brokers"
	"sync"
)

// NewBroker returns the service's message [brokers.Broker]. If no instance has
// being memoize yet the [*sync.WaitGroup] is required, please do this on
// program startup. If the instance is already memoized, pass nil as
// [*sync.WaitGroup].
func NewBroker(wg *sync.WaitGroup) brokers.Broker {
	return brokers.New(wg)
}

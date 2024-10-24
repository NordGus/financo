package message_bus

import "sync"

// Consumer is a service that consumes [Payload]s
type Consumer[Payload any] interface {
	// Consume is a function that accepts a [*sync.WaitGroup] from the [Broker]
	// and the [Payload].
	//
	// The provided [*sync.WaitGroup] should be only use to indicate when the
	// work is done.
	Consume(wg *sync.WaitGroup, payload Payload)
}

type ConsumerFunc[Payload any] func(wg *sync.WaitGroup, payload Payload)

func (f ConsumerFunc[Payload]) Consume(wg *sync.WaitGroup, payload Payload) {
	f(wg, payload)
}

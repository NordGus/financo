package message_bus

import (
	"fmt"
	"math"
	"sync"
)

// Message is bus to which consumers subscribe to and publishers publish to.
type Message[Payload any] interface {
	// Subscribe allows the given [Consumer] to subscribe to the [Message].
	//
	// It returns an error if the [Message] can't handle more consumers.
	Subscribe(consumer Consumer[Payload]) error

	// Publish publishes the given [Message] and its payload to the [Broker].
	//
	// It returns an error if something fails during publishing.
	Publish(payload Payload) error
}

type message[Payload any] struct {
	name          string
	wg            *sync.WaitGroup
	consumers     [math.MaxUint8]Consumer[Payload]
	consumerCount int
}

func New[Payload any](wg *sync.WaitGroup, name string) Message[Payload] {
	return &message[Payload]{
		name:          name,
		wg:            wg,
		consumers:     [math.MaxUint8]Consumer[Payload]{},
		consumerCount: 0,
	}
}

func (m *message[Payload]) Subscribe(consumer Consumer[Payload]) error {
	if m.consumerCount == math.MaxUint8 {
		return fmt.Errorf("message_bus: %s can't handle more consumers", m.name)
	}

	m.wg.Add(1)
	m.consumerCount++
	m.consumers[m.consumerCount] = consumer
	m.wg.Done()

	return nil
}

func (m *message[Payload]) Publish(payload Payload) error {
	m.wg.Add(m.consumerCount + 1)
	defer m.wg.Done()

	for i := 0; i < m.consumerCount; i++ {
		go m.consumers[i](m.wg, payload)
	}

	return nil
}

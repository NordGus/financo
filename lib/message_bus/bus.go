package message_bus

import (
	"fmt"
	"math"
	"sync"
)

// Bus is bus to which consumers subscribe to and publishers publish to.
type Bus[Payload any] interface {
	// Subscribe allows the given [Consumer] to subscribe to the [Bus].
	//
	// It returns an error if the [Bus] can't handle more consumers.
	Subscribe(consumer Consumer[Payload]) error

	// Publish publishes the given message and its payload to the [Bus] and
	// returns a channel to signal it was consumed by all subscribed [Consumer].
	//
	// It returns an error if something fails during publishing.
	Publish(payload Payload) (<-chan struct{}, error)
}

type messageBus[Payload any] struct {
	sync.RWMutex

	name          string
	wg            *sync.WaitGroup
	consumers     [math.MaxUint8]Consumer[Payload]
	consumerCount int
}

func New[Payload any](wg *sync.WaitGroup, name string) Bus[Payload] {
	return &messageBus[Payload]{
		name:          name,
		wg:            wg,
		consumers:     [math.MaxUint8]Consumer[Payload]{},
		consumerCount: 0,
	}
}

func (m *messageBus[Payload]) Subscribe(consumer Consumer[Payload]) error {
	if m.consumerCount > math.MaxUint8 {
		return fmt.Errorf("message_bus: %s can't handle more consumers", m.name)
	}

	m.wg.Add(1)
	m.RWMutex.Lock()

	m.consumers[m.consumerCount] = consumer
	m.consumerCount++

	m.RWMutex.Unlock()
	m.wg.Done()

	return nil
}

func (m *messageBus[Payload]) Publish(payload Payload) (<-chan struct{}, error) {
	m.RWMutex.RLock()

	m.wg.Add(1)

	done := make(chan struct{}, 1)

	go func() {
		defer m.wg.Done()
		defer close(done)

		wg := new(sync.WaitGroup)
		wg.Add(m.consumerCount)

		for i := 0; i < m.consumerCount; i++ {
			go m.consumers[i].Consume(wg, payload)
		}

		m.RWMutex.RUnlock()
		wg.Wait()

		done <- struct{}{}
	}()

	return done, nil
}

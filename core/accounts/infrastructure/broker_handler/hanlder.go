package broker_handler

import (
	"context"
	"errors"
	"financo/core/accounts/domain/brokers"
	"financo/core/accounts/infrastructure/created_broker"
	"fmt"
	"sync"
)

type BrokerHandler interface {
	CreatedBroker() brokers.CreatedBroker
	Shutdown() error
}

type handler struct {
	ctx           context.Context
	wg            *sync.WaitGroup
	cancel        context.CancelFunc
	createdBroker brokers.CreatedBroker
}

var (
	ErrUninitialized = errors.New("broker_handler: handler was not initialized")

	instance *handler
)

// Initialize returns the context [BrokerHandler]. Please do this on program
// startup at least once for the application to work properly. If it wasn't
// initialized before, it can panic.
func Initialize(wg *sync.WaitGroup) BrokerHandler {
	if instance != nil {
		return instance
	}

	// [ ] TODO rethink the whole cancellation mechanism.
	ctx, cancel := context.WithCancel(context.Background())

	instance = &handler{
		ctx:           ctx,
		cancel:        cancel,
		wg:            wg,
		createdBroker: created_broker.NewInMemory(ctx, wg),
	}

	return instance
}

func Instance() (BrokerHandler, error) {
	if instance == nil {
		return nil, ErrUninitialized
	}

	return instance, nil
}

func (b *handler) CreatedBroker() brokers.CreatedBroker {
	return b.createdBroker
}

// [ ] TODO rethink the whole shutdown mechanism.
func (b *handler) Shutdown() error {
	select {
	case <-b.ctx.Done():
		return fmt.Errorf("accounts: broker: %s", b.ctx.Err())
	default:
		b.cancel()

		return nil
	}
}

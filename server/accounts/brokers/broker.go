package brokers

import (
	"context"
	"errors"
	"financo/server/accounts/types/message"
	"financo/server/types/message_bus"
	"sync"
)

type Broker interface {
	SubscribeToCreated(consumer message_bus.Consumer[message.Created]) error
	SubscribeToUpdated(consumer message_bus.Consumer[message.Updated]) error
	SubscribeToDeleted(consumer message_bus.Consumer[message.Deleted]) error
	Close() error
}

type broker struct {
	ctx        context.Context
	wg         *sync.WaitGroup
	cancel     context.CancelFunc
	createdBus message_bus.Bus[message.Created]
	updatedBus message_bus.Bus[message.Updated]
	deletedBus message_bus.Bus[message.Deleted]
}

var (
	instance *broker
)

func New(ctx context.Context) Broker {
	if instance != nil {
		return instance
	}

	wg := new(sync.WaitGroup)
	newCtx, cancel := context.WithCancel(ctx)

	instance = &broker{
		ctx:        newCtx,
		cancel:     cancel,
		wg:         wg,
		createdBus: message_bus.New[message.Created](wg, "account_created"),
		updatedBus: message_bus.New[message.Updated](wg, "account_updated"),
		deletedBus: message_bus.New[message.Deleted](wg, "account_deleted"),
	}

	return instance
}

func (b *broker) SubscribeToCreated(consumer message_bus.Consumer[message.Created]) error {
	return errors.New("not implemented")
}

func (b *broker) SubscribeToUpdated(consumer message_bus.Consumer[message.Updated]) error {
	return errors.New("not implemented")
}

func (b *broker) SubscribeToDeleted(consumer message_bus.Consumer[message.Deleted]) error {
	return errors.New("not implemented")
}

func (b *broker) Close() error {
	select {
	case <-b.ctx.Done():
		return b.ctx.Err()
	default:
		b.wg.Wait()
		b.cancel()

		return nil
	}
}

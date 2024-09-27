package brokers

import (
	"context"
	"financo/server/transactions/types/message"
	"financo/server/types/message_bus"
	"fmt"
	"sync"
)

type Broker interface {
	SubscribeToCreated(consumer message_bus.Consumer[message.Created]) error
	SubscribeToUpdated(consumer message_bus.Consumer[message.Updated]) error
	SubscribeToDeleted(consumer message_bus.Consumer[message.Deleted]) error
	PublishCreated(msg message.Created) error
	PublishUpdated(msg message.Updated) error
	PublishDeleted(msg message.Deleted) error
	Shutdown() error
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

// New returns a message [Broker]. If no instance has being memoize yet the
// [*sync.WaitGroup] is required, please do this on program startup. If the
// instance is already memoized, pass nil as [*sync.WaitGroup].
func New(wg *sync.WaitGroup) Broker {
	if instance != nil {
		return instance
	}

	newCtx, cancel := context.WithCancel(context.Background())

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
	select {
	case <-b.ctx.Done():
		return fmt.Errorf("accounts: broker: %s", b.ctx.Err())
	default:
		return b.createdBus.Subscribe(consumer)
	}
}

func (b *broker) SubscribeToUpdated(consumer message_bus.Consumer[message.Updated]) error {
	select {
	case <-b.ctx.Done():
		return fmt.Errorf("accounts: broker: %s", b.ctx.Err())
	default:
		return b.updatedBus.Subscribe(consumer)
	}
}

func (b *broker) SubscribeToDeleted(consumer message_bus.Consumer[message.Deleted]) error {
	select {
	case <-b.ctx.Done():
		return fmt.Errorf("accounts: broker: %s", b.ctx.Err())
	default:
		return b.deletedBus.Subscribe(consumer)
	}
}

func (b *broker) PublishCreated(msg message.Created) error {
	select {
	case <-b.ctx.Done():
		return fmt.Errorf("accounts: broker: %s", b.ctx.Err())
	default:
		return b.createdBus.Publish(msg)
	}
}

func (b *broker) PublishUpdated(msg message.Updated) error {
	select {
	case <-b.ctx.Done():
		return fmt.Errorf("accounts: broker: %s", b.ctx.Err())
	default:
		return b.updatedBus.Publish(msg)
	}
}

func (b *broker) PublishDeleted(msg message.Deleted) error {
	select {
	case <-b.ctx.Done():
		return fmt.Errorf("accounts: broker: %s", b.ctx.Err())
	default:
		return b.deletedBus.Publish(msg)
	}
}

func (b *broker) Shutdown() error {
	select {
	case <-b.ctx.Done():
		return fmt.Errorf("accounts: broker: %s", b.ctx.Err())
	default:
		b.cancel()

		return nil
	}
}

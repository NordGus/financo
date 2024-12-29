package reordered_broker

import (
	"context"
	"financo/core/scope_savings_goals/domain/brokers"
	"financo/core/scope_savings_goals/domain/messages"
	"financo/lib/message_bus"
	"fmt"
	"sync"
)

type inMemoryBroker struct {
	ctx context.Context
	wg  *sync.WaitGroup
	bus message_bus.Bus[messages.Reordered]
}

func NewInMemory(ctx context.Context, wg *sync.WaitGroup) brokers.Reordered {
	return &inMemoryBroker{
		ctx: ctx,
		wg:  wg,
		bus: message_bus.New[messages.Reordered](wg, "savings_goal_reordered"),
	}
}

func (b *inMemoryBroker) Subscribe(consumer message_bus.Consumer[messages.Reordered]) error {
	b.wg.Add(1)
	defer b.wg.Done()

	select {
	case <-b.ctx.Done():
		return fmt.Errorf("reordered_broker: failed to subscribe: %s", b.ctx.Err())
	default:
		return b.bus.Subscribe(consumer)
	}
}

func (b *inMemoryBroker) Publish(message messages.Reordered) error {
	b.wg.Add(1)
	defer b.wg.Done()

	done, err := b.bus.Publish(message)
	if err != nil {
		return err
	}

	select {
	case <-b.ctx.Done():
		return fmt.Errorf("reordered_broker: failed to publish: %s", b.ctx.Err())
	case <-done:
		return nil
	}
}

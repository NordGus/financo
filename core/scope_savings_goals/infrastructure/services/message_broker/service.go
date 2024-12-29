package message_broker

import (
	"context"
	"financo/core/scope_savings_goals/domain/brokers"
	"financo/core/scope_savings_goals/domain/errors"
	"financo/core/scope_savings_goals/domain/services"
	"financo/core/scope_savings_goals/infrastructure/brokers/created_broker"
	"financo/core/scope_savings_goals/infrastructure/brokers/deleted_broker"
	"financo/core/scope_savings_goals/infrastructure/brokers/marked_as_achieved_broker"
	"financo/core/scope_savings_goals/infrastructure/brokers/reordered_broker"
	"financo/core/scope_savings_goals/infrastructure/brokers/updated_broker"
	"fmt"
	"sync"
)

type service struct {
	ctx              context.Context
	wg               *sync.WaitGroup
	cancel           context.CancelFunc
	created          brokers.Created
	deleted          brokers.Deleted
	updated          brokers.Updated
	reordered        brokers.Reordered
	markedAsAchieved brokers.MarkedAsAchieved
}

var instance *service

// Initialize returns the context [services.MessageBroker]. Please do this on
// program startup at least once for the application to work properly.
// If it wasn't initialized before, it can panic.
func Initialize(wg *sync.WaitGroup) services.MessageBroker {
	if instance != nil {
		return instance
	}

	// [ ] TODO rethink the whole cancellation mechanism.
	ctx, cancel := context.WithCancel(context.Background())

	instance = &service{
		ctx:              ctx,
		cancel:           cancel,
		wg:               wg,
		created:          created_broker.NewInMemory(ctx, wg),
		deleted:          deleted_broker.NewInMemory(ctx, wg),
		updated:          updated_broker.NewInMemory(ctx, wg),
		reordered:        reordered_broker.NewInMemory(ctx, wg),
		markedAsAchieved: marked_as_achieved_broker.NewInMemory(ctx, wg),
	}

	return instance
}

func Instance() (services.MessageBroker, error) {
	if instance == nil {
		return nil, errors.ErrMessageBrokerUninitialized
	}

	return instance, nil
}

func (b *service) Created() brokers.Created {
	return b.created
}

func (b *service) Deleted() brokers.Deleted {
	return b.deleted
}

func (b *service) Updated() brokers.Updated {
	return b.updated
}

func (b *service) Reordered() brokers.Reordered {
	return b.reordered
}

func (b *service) MarkedAsAchieved() brokers.MarkedAsAchieved {
	return b.markedAsAchieved
}

// [ ] TODO rethink the whole shutdown mechanism.
func (b *service) Close() error {
	select {
	case <-b.ctx.Done():
		return fmt.Errorf("savings_goals: broker: %s", b.ctx.Err())
	default:
		b.cancel()

		return nil
	}
}

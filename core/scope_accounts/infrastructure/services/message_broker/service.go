package message_broker

import (
	"context"
	"financo/core/scope_accounts/domain/brokers"
	"financo/core/scope_accounts/domain/services"
	"financo/core/scope_accounts/infrastructure/brokers/archived_broker"
	"financo/core/scope_accounts/infrastructure/brokers/created_broker"
	"financo/core/scope_accounts/infrastructure/brokers/deleted_broker"
	"financo/core/scope_accounts/infrastructure/brokers/unarchived_broker"
	"financo/core/scope_accounts/infrastructure/brokers/updated_broker"
	"financo/services/shutdown"
	"fmt"
	"sync"
)

type service struct {
	wg     *sync.WaitGroup
	ctx    context.Context
	cancel context.CancelFunc

	created    brokers.Created
	deleted    brokers.Deleted
	updated    brokers.Updated
	archived   brokers.Archived
	unarchived brokers.Unarchived
}

var instance *service

// New returns an instance of [services.MessageBroker] for the accounts scope.
//
// - It will either return the exiting instance or initialize a new one.
//
// - It will panic if it fails to initialize a new instance.
//
// Must be close on program termination by calling Close to free resources.
func New() services.MessageBroker {
	if instance != nil {
		return instance
	}

	shutdown.AddTask(1)
	defer shutdown.TaskDone()

	wg := new(sync.WaitGroup)
	ctx, cancel := context.WithCancel(context.TODO())

	instance = &service{
		ctx:        ctx,
		cancel:     cancel,
		wg:         wg,
		created:    created_broker.NewInMemory(ctx, wg),
		deleted:    deleted_broker.NewInMemory(ctx, wg),
		updated:    updated_broker.NewInMemory(ctx, wg),
		archived:   archived_broker.NewInMemory(ctx, wg),
		unarchived: unarchived_broker.NewInMemory(ctx, wg),
	}

	return instance
}

func (s *service) Created() brokers.Created {
	return s.created
}

func (s *service) Deleted() brokers.Deleted {
	return s.deleted
}

func (s *service) Updated() brokers.Updated {
	return s.updated
}

func (s *service) Archived() brokers.Archived {
	return s.archived
}

func (s *service) Unarchived() brokers.Unarchived {
	return s.unarchived
}

func (s *service) Health() map[string]string {
	stats := make(map[string]string)

	if s.ctx.Err() != nil {
		stats["status"] = "down"
		stats["message"] = "Service is down"

		return stats
	}

	stats["status"] = "up"
	stats["message"] = "It's healthy"

	return stats
}

func (s *service) Close() error {
	select {
	case <-s.ctx.Done():
		return fmt.Errorf("accounts: broker: %s", s.ctx.Err())
	default:
		s.wg.Wait()
		s.cancel()

		return nil
	}
}

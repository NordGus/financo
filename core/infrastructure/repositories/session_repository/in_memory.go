package session_repository

import (
	"context"
	"financo/core/domain/repositories"
	"financo/core/domain/services"
	"financo/models/session"
	"time"

	"github.com/google/uuid"
)

type inMemory struct {
	store services.SessionStoreService
}

func NewInMemory(store services.SessionStoreService) repositories.Session {
	return &inMemory{
		store: store,
	}
}

func (r *inMemory) Create(ctx context.Context, duration time.Duration) (session.Record, error) {
	record := session.Record{
		ID:        uuid.NewString(),
		ExpiresAt: time.Now().UTC().Add(duration),
	}

	err := r.store.Save(ctx, record)
	if err != nil {
		return record, err
	}

	return record, nil
}

func (r *inMemory) Delete(ctx context.Context, record session.Record) error {
	return r.store.Delete(ctx, record)
}

func (r *inMemory) Find(ctx context.Context, id string) (session.Record, error) {
	return r.store.Find(ctx, id)
}

func (r *inMemory) Save(ctx context.Context, record session.Record) error {
	return r.store.Save(ctx, record)
}

package repositories

import (
	"context"
	"financo/models/session"
	"time"
)

type Session interface {
	Create(ctx context.Context, duration time.Duration) (session.Record, error)
	Find(ctx context.Context, id string) (session.Record, error)
	Save(ctx context.Context, record session.Record) error
	Delete(ctx context.Context, record session.Record) error
}

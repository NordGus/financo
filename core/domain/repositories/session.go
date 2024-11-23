package repositories

import (
	"context"
	"financo/models/session"
)

type Session interface {
	Find(ctx context.Context, id string) (session.Record, error)
	Save(ctx context.Context, record session.Record) error
	Delete(ctx context.Context, record session.Record) error
}

package repositories

import (
	"context"
	"financo/core/scope_categories/domain/models/category"
	"time"
)

type ArchivalRepository interface {
	Archive(ctx context.Context, record category.Record, timestamp time.Time) (category.Record, error)
	Unarchive(ctx context.Context, record category.Record, timestamp time.Time) (category.Record, error)
}

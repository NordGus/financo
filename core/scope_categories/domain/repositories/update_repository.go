package repositories

import (
	"context"
	"financo/core/scope_categories/domain/models/category"
)

type UpdateRepository interface {
	Find(ctx context.Context, id int64) (category.Record, error)
	Save(ctx context.Context, r category.Record) error
}

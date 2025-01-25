package repositories

import (
	"context"
	"financo/core/scope_categories/domain/models/category"
)

type CategoryRepository interface {
	Find(ctx context.Context, id int64) (category.Record, error)
}

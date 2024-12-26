package repositories

import (
	"context"
	"financo/core/scope_categories/domain/models/category"
)

type DeleteRepository interface {
	Find(ctx context.Context, id int64) (category.Record, error)
	SoftDelete(ctx context.Context, record category.Record) error
}

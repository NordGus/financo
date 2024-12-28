package repositories

import (
	"context"
	"financo/core/scope_categories/domain/models/category"
)

type UpdateDynamicDataRepository interface {
	Save(ctx context.Context, records []category.Record) error
}

package repositories

import (
	"context"
	"financo/core/scope_categories/domain/filters"
	"financo/core/scope_categories/domain/models/category"
)

type CategoriesRepository interface {
	Where(ctx context.Context, f filters.Categories) ([]category.Record, error)
}

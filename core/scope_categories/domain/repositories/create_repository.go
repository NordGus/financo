package repositories

import (
	"context"
	"financo/core/scope_categories/domain/models/category"
	"financo/models/account"
)

type CreateRepository interface {
	Save(ctx context.Context, parent account.Record, children []account.Record) (category.Record, error)
}

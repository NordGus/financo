package repositories

import (
	"context"
	"financo/core/scope_savings_goals/domain/filters"
	"financo/lib/currency"
)

type Savings interface {
	Where(ctx context.Context, f filters.Savings) (map[currency.Type]int64, error)
}

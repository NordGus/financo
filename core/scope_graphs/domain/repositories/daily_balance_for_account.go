package repositories

import (
	"context"
	"financo/core/scope_graphs/domain/filters"
	"financo/core/scope_graphs/domain/responses"
)

type DailyBalanceForAccount interface {
	Find(ctx context.Context, filter filters.DailyBalanceForAccount) ([]responses.Summary, error)
}

package repositories

import (
	"context"
	"financo/core/scope_graphs/domain/filters"
	"financo/core/scope_graphs/domain/responses"
)

type BalanceForAccount interface {
	Find(ctx context.Context, filter filters.BalanceForAccount) ([]responses.Summary, error)
}

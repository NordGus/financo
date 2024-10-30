package repositories

import (
	"context"
	"financo/core/scope_graphs/domain/filters"
	"financo/core/scope_graphs/domain/responses"
)

type BalanceForKinds interface {
	Find(ctx context.Context, filter filters.BalanceForKinds) ([]responses.Summary, error)
}

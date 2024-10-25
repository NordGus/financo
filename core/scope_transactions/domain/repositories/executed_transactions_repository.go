package repositories

import (
	"context"
	"financo/core/scope_transactions/domain/filters"
	"financo/core/scope_transactions/domain/responses"
)

type ExecutedTransactionsRepository interface {
	Find(ctx context.Context, filter filters.ExecutedTransactionsFilter) ([]responses.Detailed, error)
	FindForAccount(
		ctx context.Context, filter filters.ExecutedTransactionsForAccountFilter,
	) ([]responses.Detailed, error)
}

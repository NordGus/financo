package repositories

import (
	"context"
	"financo/core/scope_transactions/domain/filters"
	"financo/core/scope_transactions/domain/responses"
)

type ExecutedTransactionsRepository interface {
	Find(ctx context.Context, filter filters.TransactionsFilter) ([]responses.Detailed, error)
	FindForAccount(ctx context.Context, filter filters.TransactionsForAccountFilter) ([]responses.Detailed, error)
}

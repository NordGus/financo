package repositories

import (
	"context"
	"financo/core/scope_transactions/domain/filters"
	"financo/models/transaction"
)

type TransactionsRepository interface {
	Where(ctx context.Context, f filters.List) ([]transaction.Record, error)
}

package repositories

import (
	"context"
	"financo/models/transaction"
)

type CreateTransactionRepository interface {
	Save(ctx context.Context, record transaction.Record) (transaction.Record, error)
}

package repositories

import (
	"context"
	"financo/models/transaction"
)

type UpdateTransactionRepository interface {
	Save(ctx context.Context, record transaction.Record) error
}

package repositories

import (
	"context"
	"financo/models/transaction"
)

type TransactionRepository interface {
	Find(ctx context.Context, id int64) (transaction.Record, error)
}

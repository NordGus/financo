package repositories

import (
	"context"
	"financo/models/transaction"
)

type DeleteTransactionRepository interface {
	SoftDelete(ctx context.Context, record transaction.Record) error
}

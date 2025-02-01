package repositories

import (
	"context"
	"financo/models/transaction"
)

type UpdateRepository interface {
	Save(ctx context.Context, record transaction.Record) error
}

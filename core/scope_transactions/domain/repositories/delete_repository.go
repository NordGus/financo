package repositories

import (
	"context"
	"financo/models/transaction"
)

type DeleteRepository interface {
	SoftDelete(ctx context.Context, record transaction.Record) error
}

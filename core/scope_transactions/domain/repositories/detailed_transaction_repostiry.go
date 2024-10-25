package repositories

import (
	"context"
	"financo/core/scope_transactions/domain/responses"
)

type DetailedTransactionRepository interface {
	Find(ctx context.Context, id int64) (responses.Detailed, error)
}

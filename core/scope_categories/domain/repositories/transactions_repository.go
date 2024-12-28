package repositories

import "context"

type TransactionsRepository interface {
	CountFor(ctx context.Context, ids []int64) (map[int64]int64, error)
}

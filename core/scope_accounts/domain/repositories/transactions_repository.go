package repositories

import "context"

type TransactionsRepository interface {
	BalanceWithoutHistoryFor(ctx context.Context, id int64) (int64, error)
	CountWithoutHistoryFor(ctx context.Context, id int64) (int64, error)
	BalanceFor(ctx context.Context, ids []int64) (map[int64]int64, error)
	CountFor(ctx context.Context, ids []int64) (map[int64]int64, error)
}

package repositories

import (
	"context"
	"financo/models/account"
)

type Account interface {
	Find(ctx context.Context, id int64) (account.Record, error)
}

package repositories

import (
	"context"
	"financo/models/account"
)

type AccountRepository interface {
	Find(ctx context.Context, id int64) (account.Record, error)
}

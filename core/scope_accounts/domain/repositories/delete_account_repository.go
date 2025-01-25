package repositories

import (
	"context"
	"financo/models/account"
)

type DeleteAccountRepository interface {
	Find(ctx context.Context, id int64) (account.Record, error)
	SoftDelete(ctx context.Context, r account.Record) error
}

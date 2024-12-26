package repositories

import (
	"context"
	"financo/models/account"
)

type CreateRepository interface {
	Save(ctx context.Context, parent account.Record, children []account.Record) (account.Record, error)
}

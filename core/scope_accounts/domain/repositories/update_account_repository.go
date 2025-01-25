package repositories

import (
	"context"
	"financo/models/account"
	"financo/models/transaction"
)

type UpdateAccountState struct {
	Record      account.Record
	History     account.Record
	Transaction transaction.Record
}

type UpdateAccountRepository interface {
	Find(ctx context.Context, id int64) (UpdateAccountState, error)
	Save(ctx context.Context, state UpdateAccountState) error
}

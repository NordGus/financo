package repositories

import (
	"context"
	"financo/core/domain/records/account"
	"financo/server/types/generic/nullable"
)

// [ ] Refactor account.Record inside this domain

type CreateAccountSaveArgs struct {
	Record  account.Record
	History nullable.Type[account.Record]
}

type CreateAccountRepository interface {
	Save(ctx context.Context, args CreateAccountSaveArgs) (account.Record, error)
}

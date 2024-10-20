package repositories

import (
	"context"
	"financo/server/types/generic/nullable"
	"financo/server/types/records/account"
)

// [ ] Refactor account.Record inside this domain

type CreateAccountSaveArgs struct {
	Record  account.Record
	History nullable.Type[account.Record]
}

type CreateAccountRepository interface {
	Save(ctx context.Context, args CreateAccountSaveArgs) (account.Record, error)
}

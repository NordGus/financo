package repositories

import (
	"context"
	"financo/lib/nullable"
	"financo/models/account"
	"financo/models/transaction"
)

type CreateAccountSaveArgs struct {
	Record             account.Record
	History            account.Record
	HistoryTransaction nullable.Type[transaction.Record]
	Interest           nullable.Type[account.Record]
}

type CreateAccountRepository interface {
	Save(ctx context.Context, args CreateAccountSaveArgs) (account.Record, error)
}

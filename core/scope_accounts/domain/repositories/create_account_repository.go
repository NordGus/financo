package repositories

import (
	"context"
	"financo/models/account"
	"financo/models/transaction"
)

type CreateAccountSaveArgs struct {
	Record             account.Record
	History            account.Record
	HistoryTransaction transaction.Record
}

type CreateAccountRepository interface {
	Save(ctx context.Context, args CreateAccountSaveArgs) (account.Record, error)
}

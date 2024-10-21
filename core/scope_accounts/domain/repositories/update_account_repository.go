package repositories

import (
	"context"
	"financo/core/scope_accounts/domain/responses"
	"financo/server/types/generic/nullable"
	"financo/server/types/records/account"
	"financo/server/types/records/transaction"
)

type AccountWithHistory struct {
	Record  account.Record
	History account.Record
}

type SaveAccountWithHistoryArgs struct {
	Record      account.Record
	Transaction nullable.Type[transaction.Record]
}

type UpdateAccountRepository interface {
	FindAccountWithHistory(ctx context.Context, id int64) (AccountWithHistory, error)
	SaveAccountWithHistory(ctx context.Context, args SaveAccountWithHistoryArgs) (responses.Detailed, error)
}

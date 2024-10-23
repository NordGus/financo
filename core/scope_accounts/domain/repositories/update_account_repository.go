package repositories

import (
	"context"
	"financo/core/scope_accounts/domain/responses"
	"financo/server/types/generic/nullable"
	"financo/server/types/records/account"
	"financo/server/types/records/transaction"
)

type AccountWithHistory struct {
	Record      account.Record
	History     account.Record
	Transaction nullable.Type[transaction.Record]
}

type AccountWithChildren struct {
	Record   account.Record
	Children []account.Record
}

type SaveAccountWithHistoryArgs struct {
	Record      account.Record
	History     account.Record
	Transaction nullable.Type[transaction.Record]
}

type SaveAccountWithChildrenArgs struct {
	Record   account.Record
	Children []account.Record
}

type UpdateAccountWithHistoryRepository interface {
	FindWithHistory(ctx context.Context, id int64) (AccountWithHistory, error)
	SaveWithHistory(ctx context.Context, args SaveAccountWithHistoryArgs) (responses.Detailed, error)
}

type UpdateAccountWithChildrenRepository interface {
	FindWithChildren(ctx context.Context, id int64) (AccountWithChildren, error)
	SaveWithChildren(ctx context.Context, args SaveAccountWithChildrenArgs) (responses.Detailed, error)
}

type UpdateAccountRepository interface {
	UpdateAccountWithHistoryRepository
	UpdateAccountWithChildrenRepository
}

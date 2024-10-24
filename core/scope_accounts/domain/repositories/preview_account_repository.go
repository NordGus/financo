package repositories

import (
	"context"
	"financo/core/scope_accounts/domain/responses"
	"financo/server/types/generic/nullable"
	"financo/server/types/records/account"
)

type PreviewAccountRepositoryFilter struct {
	Kinds    []account.Kind
	Archived nullable.Type[bool]
}

type PreviewAccountRepository interface {
	Find(ctx context.Context, filters PreviewAccountRepositoryFilter) ([]responses.Preview, error)
}

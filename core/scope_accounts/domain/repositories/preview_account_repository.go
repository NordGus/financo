package repositories

import (
	"context"
	"financo/core/domain/records/account"
	"financo/core/scope_accounts/domain/responses"
	"financo/server/types/generic/nullable"
)

type PreviewAccountRepositoryFilter struct {
	Kinds    []account.Kind
	Archived nullable.Type[bool]
}

type PreviewAccountRepository interface {
	Find(ctx context.Context, filter PreviewAccountRepositoryFilter) ([]responses.Preview, error)
}

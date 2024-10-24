package repositories

import (
	"context"
	"financo/core/domain/records/account"
	"financo/core/domain/types/nullable"
	"financo/core/scope_accounts/domain/responses"
)

type PreviewAccountRepositoryFilter struct {
	Kinds    []account.Kind
	Archived nullable.Type[bool]
}

type PreviewAccountRepository interface {
	Find(ctx context.Context, filter PreviewAccountRepositoryFilter) ([]responses.Preview, error)
}

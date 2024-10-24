package repositories

import (
	"context"
	"financo/core/scope_accounts/domain/responses"
	"financo/lib/nullable"
	"financo/models/account"
)

type PreviewAccountRepositoryFilter struct {
	Kinds    []account.Kind
	Archived nullable.Type[bool]
}

type PreviewAccountRepository interface {
	Find(ctx context.Context, filter PreviewAccountRepositoryFilter) ([]responses.Preview, error)
}

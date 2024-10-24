package repositories

import (
	"context"
	"financo/core/scope_accounts/domain/responses"
	"financo/lib/nullable"
	"financo/models/account"
)

type SelectAccountRepositoryFilter struct {
	Kinds    []account.Kind
	Archived nullable.Type[bool]
}

type SelectAccountRepository interface {
	Find(ctx context.Context, filter SelectAccountRepositoryFilter) ([]responses.Select, error)
}

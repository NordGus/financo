package repositories

import (
	"context"
	"financo/core/domain/records/account"
	"financo/core/domain/types/nullable"
	"financo/core/scope_accounts/domain/responses"
)

type SelectAccountRepositoryFilter struct {
	Kinds    []account.Kind
	Archived nullable.Type[bool]
}

type SelectAccountRepository interface {
	Find(ctx context.Context, filter SelectAccountRepositoryFilter) ([]responses.Select, error)
}

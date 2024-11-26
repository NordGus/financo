package repositories

import (
	"context"
	"financo/core/scope_accounts/domain/filters"
	"financo/models/account"
)

type AccountsRepository interface {
	Where(ctx context.Context, f filters.Accounts) ([]account.Record, error)
}

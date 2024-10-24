package repositories

import (
	"context"
	"financo/core/scope_accounts/domain/responses"
)

type DetailedAccountRepository interface {
	Find(ctx context.Context, id int64) (responses.Detailed, error)
	FindChildren(ctx context.Context, parentID int64) ([]responses.DetailedChild, error)
}

package repositories

import (
	"context"
	"financo/models/account"
)

type AccountsRepository interface {
	Where(ctx context.Context) ([]account.Record, error)
}

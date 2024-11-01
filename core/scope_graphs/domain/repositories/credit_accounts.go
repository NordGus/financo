package repositories

import (
	"context"
	"financo/models/account"
)

type CreditAccounts interface {
	Find(ctx context.Context) ([]account.Record, error)
}

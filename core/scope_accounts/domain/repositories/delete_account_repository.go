package repositories

import (
	"context"
	"financo/server/types/records/account"
)

// [ ] Refactor account.Record inside this domain
// [ ] Refactor id type to use a domain defined one instead of primitive int64

type DeleteAccountRepository interface {
	SoftDelete(ctx context.Context, id int64) (account.Record, error)
}

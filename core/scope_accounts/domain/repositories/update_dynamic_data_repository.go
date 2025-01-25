package repositories

import (
	"context"
	"financo/models/account"
)

type UpdateDynamicDataRepository interface {
	Save(ctx context.Context, records []account.Record) error
}

package account

import (
	"financo/server/types/generic/nullable"
	"financo/server/types/shared/color"
	"financo/server/types/shared/currency"
	"financo/server/types/shared/icon"
	"time"
)

type Record struct {
	ID          int64
	ParentID    nullable.Type[int64]
	Kind        Kind
	Currency    currency.Type
	Name        string
	Description nullable.Type[string]
	Color       color.Type
	Icon        icon.Type
	Capital     int64
	ArchivedAt  nullable.Type[time.Time]
	DeletedAt   nullable.Type[time.Time]
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

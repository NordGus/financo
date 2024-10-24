package account

import (
	"financo/lib/color"
	"financo/lib/currency"
	"financo/lib/icon"
	"financo/lib/nullable"
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

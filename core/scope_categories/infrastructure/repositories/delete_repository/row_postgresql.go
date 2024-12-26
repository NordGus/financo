package delete_repository

import (
	"financo/lib/color"
	"financo/lib/currency"
	"financo/lib/icon"
	"financo/lib/nullable"
	"financo/models/account"
	"time"
)

// postgresqlRow is an internal implementation detail for the postgresql repo
type postgresqlRow struct {
	Parent account.Record

	ID          nullable.Type[int64]
	ParentID    nullable.Type[int64]
	Kind        nullable.Type[account.Kind]
	Currency    nullable.Type[currency.Type]
	Name        nullable.Type[string]
	Description nullable.Type[string]
	Color       nullable.Type[color.Type]
	Icon        nullable.Type[icon.Type]
	Capital     nullable.Type[int64]
	ArchivedAt  nullable.Type[time.Time]
	DeletedAt   nullable.Type[time.Time]
	CreatedAt   nullable.Type[time.Time]
	UpdatedAt   nullable.Type[time.Time]
	DynamicData nullable.Type[account.DynamicData]
}

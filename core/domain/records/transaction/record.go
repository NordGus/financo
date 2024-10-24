package transaction

import (
	"financo/server/types/generic/nullable"
	"time"
)

type Record struct {
	ID           int64
	SourceID     int64
	TargetID     int64
	SourceAmount int64
	TargetAmount int64
	Notes        nullable.Type[string]
	IssuedAt     time.Time
	ExecutedAt   nullable.Type[time.Time]
	DeletedAt    nullable.Type[time.Time]
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

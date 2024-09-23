package achievement

import (
	"financo/server/types/generic/nullable"
	"time"
)

type Record[Settings any] struct {
	ID         int64
	Kind       Kind
	Name       string
	Settings   Settings
	AchievedAt nullable.Type[time.Time]
	DeletedAt  nullable.Type[time.Time]
	CreatedAt  time.Time
	UpdatedAt  time.Time
}

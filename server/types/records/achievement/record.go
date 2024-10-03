package achievement

import (
	"financo/server/types/generic/nullable"
	"time"
)

type Record[Settings any] struct {
	ID         int64                    `json:"id"`
	Kind       Kind                     `json:"kind"`
	Name       string                   `json:"name"`
	Settings   Settings                 `json:"settings"`
	AchievedAt nullable.Type[time.Time] `json:"achievedAt"`
	DeletedAt  nullable.Type[time.Time] `json:"deletedAt"`
	CreatedAt  time.Time                `json:"createdAt"`
	UpdatedAt  time.Time                `json:"updatedAt"`
}

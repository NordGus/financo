package achievement

import (
	"financo/core/domain/types/nullable"
	"time"
)

type Record[Settings any] struct {
	ID          int64                    `json:"id"`
	Kind        Kind                     `json:"kind"`
	Name        string                   `json:"name"`
	Description nullable.Type[string]    `json:"description"`
	Settings    Settings                 `json:"settings"`
	AchievedAt  nullable.Type[time.Time] `json:"achievedAt"`
	DeletedAt   nullable.Type[time.Time] `json:"deletedAt"`
	CreatedAt   time.Time                `json:"createdAt"`
	UpdatedAt   time.Time                `json:"updatedAt"`
}

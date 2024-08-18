package request

import (
	"financo/server/types/generic/nullable"
	"time"
)

type Create struct {
	IssuedAt     time.Time                `json:"issuedAt"`
	ExecutedAt   nullable.Type[time.Time] `json:"executedAt"`
	Notes        nullable.Type[string]    `json:"notes"`
	SourceID     int64                    `json:"sourceID"`
	TargetID     int64                    `json:"targetID"`
	SourceAmount int64                    `json:"sourceAmount"`
	TargetAmount int64                    `json:"targetAmount"`
}

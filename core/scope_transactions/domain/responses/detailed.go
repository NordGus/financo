package responses

import (
	"financo/lib/nullable"
	"financo/models/transaction"
	"time"
)

type Detailed struct {
	ID           int64                    `json:"id"`
	IssuedAt     time.Time                `json:"issuedAt"`
	ExecutedAt   nullable.Type[time.Time] `json:"executedAt"`
	SourceID     int64                    `json:"sourceId"`
	SourceAmount int64                    `json:"sourceAmount"`
	TargetID     int64                    `json:"targetId"`
	TargetAmount int64                    `json:"targetAmount"`
	Notes        nullable.Type[string]    `json:"notes"`
	CreatedAt    time.Time                `json:"createdAt"`
	UpdatedAt    time.Time                `json:"updatedAt"`
}

func RecordToDetailed(r transaction.Record) Detailed {
	return Detailed{
		ID:           r.ID,
		IssuedAt:     r.IssuedAt,
		ExecutedAt:   r.ExecutedAt,
		SourceID:     r.SourceID,
		SourceAmount: r.SourceAmount,
		TargetID:     r.TargetID,
		TargetAmount: r.TargetAmount,
		Notes:        r.Notes,
		CreatedAt:    r.CreatedAt,
		UpdatedAt:    r.UpdatedAt,
	}
}

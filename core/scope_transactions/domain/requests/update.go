package requests

import (
	"financo/lib/currency"
	"financo/lib/nullable"
	"financo/models/transaction"
	"time"
)

type Update struct {
	ID           int64                    `json:"id"`
	IssuedAt     time.Time                `json:"issuedAt"`
	ExecutedAt   nullable.Type[time.Time] `json:"executedAt"`
	Notes        nullable.Type[string]    `json:"notes"`
	Currency     currency.Type            `json:"currency"`
	SourceID     int64                    `json:"sourceID"`
	TargetID     int64                    `json:"targetID"`
	SourceAmount int64                    `json:"sourceAmount"`
	TargetAmount int64                    `json:"targetAmount"`
	Kind         transaction.Kind         `json:"kind"`
}

func (r Update) ToTransactionRecord(timestamp time.Time) transaction.Record {
	record := transaction.Record{
		ID:           r.ID,
		SourceID:     r.SourceID,
		TargetID:     r.TargetID,
		SourceAmount: r.SourceAmount,
		TargetAmount: r.TargetAmount,
		Notes:        r.Notes,
		Currency:     r.Currency,
		IssuedAt:     r.IssuedAt.UTC(),
		ExecutedAt:   r.ExecutedAt,
		DeletedAt:    nullable.Type[time.Time]{},
		CreatedAt:    timestamp,
		UpdatedAt:    timestamp,
	}

	if record.ExecutedAt.Valid {
		record.ExecutedAt = nullable.New(record.ExecutedAt.Val.UTC())
	}

	record.Metadata.Kind = r.Kind

	return record
}

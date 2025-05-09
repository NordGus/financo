package requests

import (
	"financo/lib/currency"
	"financo/lib/nullable"
	"financo/models/transaction"
	"time"
)

type Update struct {
	ID           int64                 `json:"id"`
	IssuedAt     string                `json:"issuedAt"`
	ExecutedAt   nullable.Type[string] `json:"executedAt"`
	Notes        nullable.Type[string] `json:"notes"`
	Currency     currency.Type         `json:"currency"`
	SourceID     int64                 `json:"sourceId"`
	TargetID     int64                 `json:"targetId"`
	SourceAmount int64                 `json:"sourceAmount"`
	TargetAmount int64                 `json:"targetAmount"`
	Kind         transaction.Kind      `json:"kind"`
}

func (r Update) ToTransactionRecord(timestamp time.Time) (transaction.Record, error) {
	record := transaction.Record{
		ID:           r.ID,
		SourceID:     r.SourceID,
		TargetID:     r.TargetID,
		SourceAmount: r.SourceAmount,
		TargetAmount: r.TargetAmount,
		Notes:        r.Notes,
		Currency:     r.Currency,
		DeletedAt:    nullable.Type[time.Time]{},
		CreatedAt:    timestamp,
		UpdatedAt:    timestamp,
	}

	issuedAt, err := time.Parse(time.DateOnly, r.IssuedAt)
	if err != nil {
		return record, err
	}
	record.IssuedAt = issuedAt.UTC()

	if r.ExecutedAt.Valid {
		executed, err := time.Parse(time.DateOnly, r.ExecutedAt.Val)
		if err != nil {
			return record, err
		}

		record.ExecutedAt = nullable.New(executed.UTC())
	}

	record.Metadata.Kind = r.Kind

	return record, err
}

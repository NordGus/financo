package requests

import (
	"financo/lib/currency"
	"financo/lib/nullable"
	"financo/models/achievement/savings_goal"
	"time"
)

type Update struct {
	ID          int64                 `json:"id"`
	Name        string                `json:"name"`
	Description nullable.Type[string] `json:"description"`
	Currency    currency.Type         `json:"currency"`
	Target      int64                 `json:"target"`
}

func (r Update) UpdateRecord(record savings_goal.Record, timestamp time.Time) savings_goal.Record {
	if record.ID == r.ID {
		record.Name = r.Name
		record.Description = r.Description
		record.Settings.Currency = r.Currency
		record.Settings.Target = r.Target
	}

	record.UpdatedAt = timestamp

	return record
}

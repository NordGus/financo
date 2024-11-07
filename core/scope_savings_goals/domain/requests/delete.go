package requests

import (
	"financo/lib/nullable"
	"financo/models/achievement/savings_goal"
	"time"
)

type Delete struct {
	ID int64
}

func (r Delete) UpdateRecord(record savings_goal.Record, timestamp time.Time) savings_goal.Record {
	if record.ID == r.ID {
		record.DeletedAt = nullable.New(timestamp)
	}

	record.UpdatedAt = timestamp

	return record
}

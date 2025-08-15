package requests

import (
	"financo/core/domain/primitives/date"
	"financo/lib/nullable"
	"financo/models/achievement/savings_goal"
	"time"
)

type MarkAsAchieved struct {
	ID         int64
	AchievedAt date.Type
}

func (r MarkAsAchieved) UpdateRecord(record savings_goal.Record, timestamp time.Time) savings_goal.Record {
	if r.ID == record.ID {
		record.AchievedAt = nullable.New(r.AchievedAt.ToTime().UTC())
		record.UpdatedAt = timestamp
	}

	return record
}

package requests

import (
	"financo/lib/nullable"
	"financo/models/achievement/savings_goal"
	"time"
)

type MarkAsAchieved struct {
	ID         int64
	AchievedAt time.Time
}

func (r MarkAsAchieved) UpdateRecord(record savings_goal.Record, timestamp time.Time) savings_goal.Record {
	if r.ID == record.ID {
		record.AchievedAt = nullable.New(r.AchievedAt.UTC())
		record.UpdatedAt = timestamp
	}

	return record
}

package repositories

import (
	"context"
	"financo/models/achievement/savings_goal"
)

type MarkAsAchieved interface {
	Find(ctx context.Context, id int64) (savings_goal.Record, error)
	Save(ctx context.Context, record savings_goal.Record) error
}

package repositories

import (
	"context"
	"financo/models/achievement/savings_goal"
)

type DeleteSavingsGoal interface {
	Find(ctx context.Context, id int64) (savings_goal.Record, error)
	SoftDelete(ctx context.Context, record savings_goal.Record) error
}

package repositories

import (
	"context"
	"financo/core/scope_savings_goals/domain/filters"
	"financo/models/achievement/savings_goal"
)

type ReorderRepository interface {
	Find(ctx context.Context, id int64) (savings_goal.Record, error)
	Where(ctx context.Context, f filters.SavingsGoals) ([]savings_goal.Record, error)
}

package repositories

import (
	"context"
	"financo/core/scope_savings_goals/domain/filters"
	"financo/models/achievement/savings_goal"
)

type SavingsGoalsRepository interface {
	Where(ctx context.Context, f filters.SavingsGoals) ([]savings_goal.Record, error)
}

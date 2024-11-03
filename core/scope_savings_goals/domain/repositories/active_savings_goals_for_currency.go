package repositories

import (
	"context"
	"financo/lib/currency"
	"financo/models/achievement/savings_goal"
)

type ActiveSavingsGoalsForCurrency interface {
	Find(ctx context.Context, cur currency.Type) ([]savings_goal.Record, error)
}

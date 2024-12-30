package repositories

import (
	"context"
	"financo/models/achievement/savings_goal"
)

type CreateRepository interface {
	Save(ctx context.Context, record savings_goal.Record) (savings_goal.Record, error)
}

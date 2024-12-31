package repositories

import (
	"context"
	"financo/models/achievement/savings_goal"
)

type UpdateRepository interface {
	Save(ctx context.Context, record savings_goal.Record) error
	SaveMultiple(ctx context.Context, records []savings_goal.Record) error
}

package repositories

import (
	"context"
	"financo/models/achievement/savings_goal"
)

type Reorder interface {
	Save(ctx context.Context, records []savings_goal.Record) error
}

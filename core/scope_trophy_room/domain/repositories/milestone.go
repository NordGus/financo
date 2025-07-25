package repositories

import (
	"context"
	"financo/models/achievement"
)

type Milestone interface {
	Find(ctx context.Context, id int64) (achievement.Milestone, error)
}

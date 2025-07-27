package repositories

import (
	"context"
	"financo/models/achievement"
)

type Milestones interface {
	// Where must return [[]achievement.Milestone] sorted from newest to oldest
	Where(ctx context.Context) ([]achievement.Milestone, error)
}

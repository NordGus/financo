package repositories

import (
	"context"
	"financo/models/achievement"
)

type Milestones interface {
	// Find must return [[]achievement.Milestone] sorted from newest to oldest
	Find(ctx context.Context) ([]achievement.Milestone, error)
}

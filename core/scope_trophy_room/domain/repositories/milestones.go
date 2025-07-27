package repositories

import (
	"context"
	"financo/core/scope_trophy_room/domain/filters"
	"financo/models/achievement"
)

type Milestones interface {
	// Where must return [[]achievement.Milestone] sorted from newest to oldest
	Where(ctx context.Context, f filters.Milestones) ([]achievement.Milestone, error)
}

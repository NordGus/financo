package repositories

import (
	"context"
	"financo/core/scope_my_journey/domain/responses"
)

type SavingsGoals interface {
	Find(ctx context.Context) ([]responses.Milestone, error)
}

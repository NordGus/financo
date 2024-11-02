package repositories

import (
	"context"
	"financo/core/scope_savings_goals/domain/responses"
)

type ActiveSavingsGoals interface {
	Find(ctx context.Context) ([]responses.Active, error)
}

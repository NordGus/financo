package repositories

import (
	"context"
	"financo/core/scope_savings_goals/domain/models"
	"financo/lib/currency"
	"financo/models/achievement/savings_goal"
)

type OnAccountOperated interface {
	Find(ctx context.Context, cur currency.Type) (models.GoalsAndSavingsForCurrency, error)
	Save(ctx context.Context, records []savings_goal.Record) error
}

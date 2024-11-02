package repositories

import (
	"context"
	"financo/core/scope_savings_goals/domain/models"
	"financo/lib/currency"
)

type SavingsForCurrency interface {
	Find(ctx context.Context, cur currency.Type) (models.SavingsForCurrency, error)
}

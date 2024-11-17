package repositories

import (
	"context"
	"financo/core/scope_savings_goals/domain/models"
	"financo/lib/currency"
	"financo/models/achievement/savings_goal"
	"financo/models/transaction"
)

type OnTransactionCreated interface {
	FindAccounts(ctx context.Context, record transaction.Record) (models.AccountsForTransaction, error)
	FindGoalsForCurrency(ctx context.Context, cur currency.Type) (models.GoalsAndSavingsForCurrency, error)
	Save(ctx context.Context, records []savings_goal.Record) error
}

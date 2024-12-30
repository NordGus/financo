package savings_repository

import (
	"context"
	"financo/core/domain/databases"
	"financo/core/scope_savings_goals/domain/filters"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/lib/currency"
)

type postgresql struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.SavingsRepository {
	return &postgresql{db: db}
}

func (p *postgresql) Where(ctx context.Context, f filters.Savings) (map[currency.Type]int64, error) {
	panic("unimplemented")
}

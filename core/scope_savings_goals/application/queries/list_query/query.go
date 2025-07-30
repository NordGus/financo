package list_query

import (
	"context"
	"financo/core/domain/queries"
	"financo/core/scope_savings_goals/domain/filters"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/core/scope_savings_goals/domain/requests"
	"financo/core/scope_savings_goals/domain/responses"
	"financo/core/scope_savings_goals/infrastructure/lock"
)

type query struct {
	req   requests.Active
	goals repositories.SavingsGoalsRepository
}

func New(req requests.Active, goals repositories.SavingsGoalsRepository) queries.Query[responses.Active] {
	return &query{
		req:   req,
		goals: goals,
	}
}

func (q *query) Find(ctx context.Context) (responses.Active, error) {
	var res responses.Active

	// Locking to prevent weird behavior
	lock.GlobalLock().RLock()
	defer lock.GlobalLock().Lock() // this one can be deferred because is just a read lock

	goals, err := q.goals.Where(ctx, filters.SavingsGoals{Currency: q.req.Currency})
	if err != nil {
		return res, err
	}

	res = responses.NewActive(q.req.Currency, goals)

	return res, nil
}

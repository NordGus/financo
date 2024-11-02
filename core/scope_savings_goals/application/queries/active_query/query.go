package active_query

import (
	"context"
	"financo/core/domain/queries"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/core/scope_savings_goals/domain/responses"
)

type query struct {
	repo repositories.ActiveSavingsGoals
}

func New(repo repositories.ActiveSavingsGoals) queries.Query[[]responses.Active] {
	return &query{
		repo: repo,
	}
}

func (q *query) Find(ctx context.Context) ([]responses.Active, error) {
	res, err := q.repo.Find(ctx)
	if err != nil {
		return res, err
	}

	return res, nil
}

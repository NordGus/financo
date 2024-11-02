package timeline_query

import (
	"context"
	"financo/core/domain/queries"
	"financo/core/scope_my_journey/domain/repositories"
	"financo/core/scope_my_journey/domain/responses"
)

type query struct {
	savingsGoalsRepo repositories.SavingsGoals
}

func New(savingsGoalsRepo repositories.SavingsGoals) queries.Query[[]responses.Milestone] {
	return &query{
		savingsGoalsRepo: savingsGoalsRepo,
	}
}

func (q *query) Find(ctx context.Context) ([]responses.Milestone, error) {
	var (
		res = make([]responses.Milestone, 0, 30)
	)

	sg, err := q.savingsGoalsRepo.Find(ctx)
	if err != nil {
		return res, err
	}

	res = append(res, sg...)

	return res, nil
}

package detailed_query

import (
	"context"
	"financo/core/domain/queries"
	"financo/core/scope_transactions/domain/repositories"
	"financo/core/scope_transactions/domain/requests"
	"financo/core/scope_transactions/domain/responses"
)

type query struct {
	req  requests.Detailed
	repo repositories.DetailedTransactionRepository
}

func New(
	req requests.Detailed, repo repositories.DetailedTransactionRepository,
) queries.Query[responses.Detailed] {
	return &query{
		req:  req,
		repo: repo,
	}
}

func (q *query) Find(ctx context.Context) (responses.Detailed, error) {
	res, err := q.repo.Find(ctx, q.req.ID)
	if err != nil {
		return res, err
	}

	return res, nil
}

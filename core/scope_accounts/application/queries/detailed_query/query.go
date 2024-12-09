package detailed_query

import (
	"context"
	"financo/core/domain/queries"
	"financo/core/scope_accounts/domain/repositories"
	"financo/core/scope_accounts/domain/requests"
	"financo/core/scope_accounts/domain/responses"
)

type query struct {
	req  requests.Detailed
	repo repositories.AccountRepository
}

func New(req requests.Detailed, repo repositories.AccountRepository) queries.Query[responses.Detailed] {
	return &query{
		req:  req,
		repo: repo,
	}
}

func (q *query) Find(ctx context.Context) (responses.Detailed, error) {
	res := responses.Detailed{
		Children: make([]responses.Detailed, 0, 10),
	}

	record, err := q.repo.Find(ctx, q.req.ID)
	if err != nil {
		return res, err
	}

	children, err := q.repo.FindChildren(ctx, q.req.ID)
	if err != nil {
		return res, err
	}

	res = res.FromRecord(record, children)

	return res, nil
}

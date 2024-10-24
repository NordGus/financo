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
	repo repositories.DetailedAccountRepository
}

func New(req requests.Detailed, repo repositories.DetailedAccountRepository) queries.Query[responses.Detailed] {
	return &query{
		req:  req,
		repo: repo,
	}
}

func (q *query) Find(ctx context.Context) (responses.Detailed, error) {
	var (
		res responses.Detailed
	)

	res, err := q.repo.Find(ctx, q.req.ID)
	if err != nil {
		return res, err
	}

	res.Children, err = q.repo.FindChildren(ctx, q.req.ID)
	if err != nil {
		return res, err
	}

	for i := 0; i < len(res.Children); i++ {
		res.Balance += res.Children[i].Balance
	}

	return res, nil
}

package balance_for_account_query

import (
	"context"
	"financo/core/domain/queries"
	"financo/core/scope_graphs/domain/repositories"
	"financo/core/scope_graphs/domain/requests"
	"financo/core/scope_graphs/domain/responses"
)

type query struct {
	req  requests.BalanceForAccount
	repo repositories.BalanceForAccount
}

func New(req requests.BalanceForAccount, repo repositories.BalanceForAccount) queries.Query[[]responses.Summary] {
	return &query{
		req:  req,
		repo: repo,
	}
}

func (q *query) Find(ctx context.Context) ([]responses.Summary, error) {
	res, err := q.repo.Find(ctx, q.req.ToFilter())
	if err != nil {
		return res, err
	}

	return res, nil
}

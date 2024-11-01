package balance_summary_query

import (
	"context"
	"financo/core/domain/queries"
	"financo/core/scope_graphs/domain/repositories"
	"financo/core/scope_graphs/domain/requests"
	"financo/core/scope_graphs/domain/responses"
)

type query struct {
	req  requests.BalanceForKinds
	repo repositories.BalanceForKinds
}

func New(req requests.BalanceForKinds, repo repositories.BalanceForKinds) queries.Query[[]responses.Summary] {
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

	return res, err
}

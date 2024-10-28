package pending_query

import (
	"context"
	"financo/core/domain/queries"
	"financo/core/scope_transactions/domain/filters"
	"financo/core/scope_transactions/domain/repositories"
	"financo/core/scope_transactions/domain/requests"
	"financo/core/scope_transactions/domain/responses"
)

type query struct {
	req  requests.Pending
	repo repositories.PendingTransactionsRepository
}

func New(
	req requests.Pending, repo repositories.PendingTransactionsRepository,
) queries.Query[[]responses.Detailed] {
	return &query{
		req:  req,
		repo: repo,
	}
}

func (q *query) Find(ctx context.Context) ([]responses.Detailed, error) {
	res, err := q.repo.Find(ctx, filters.TransactionsFilter{
		From:        q.req.From,
		To:          q.req.To,
		AccountIDs:  q.req.AccountIDs,
		CategoryIDs: q.req.CategoryIDs,
	})

	return res, err
}

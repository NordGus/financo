package executed_for_account_query

import (
	"context"
	"financo/core/domain/queries"
	"financo/core/scope_transactions/domain/filters"
	"financo/core/scope_transactions/domain/repositories"
	"financo/core/scope_transactions/domain/requests"
	"financo/core/scope_transactions/domain/responses"
)

type query struct {
	req  requests.ExecutedForAccount
	repo repositories.ExecutedTransactionsRepository
}

func New(
	req requests.ExecutedForAccount, repo repositories.ExecutedTransactionsRepository,
) queries.Query[[]responses.Detailed] {
	return &query{
		req:  req,
		repo: repo,
	}
}

func (q *query) Find(ctx context.Context) ([]responses.Detailed, error) {
	res, err := q.repo.FindForAccount(ctx, filters.ExecutedTransactionsForAccountFilter{
		ID:          q.req.ID,
		From:        q.req.From,
		To:          q.req.To,
		AccountIDs:  q.req.AccountIDs,
		CategoryIDs: q.req.CategoryIDs,
	})

	return res, err
}

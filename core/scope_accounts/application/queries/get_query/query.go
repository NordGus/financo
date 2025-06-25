package get_query

import (
	"context"
	"financo/core/domain/queries"
	"financo/core/scope_accounts/domain/repositories"
	"financo/core/scope_accounts/domain/requests"
	"financo/core/scope_accounts/domain/responses"
)

type query struct {
	req  requests.Show
	repo repositories.AccountRepository
}

func New(req requests.Show, repo repositories.AccountRepository) queries.Query[responses.Listed] {
	return &query{
		req:  req,
		repo: repo,
	}
}

func (q *query) Find(ctx context.Context) (responses.Listed, error) {
	var res responses.Listed

	record, err := q.repo.Find(ctx, q.req.ID)
	if err != nil {
		return res, err
	}

	res = responses.AccountRecordToListed(record)

	return res, nil
}

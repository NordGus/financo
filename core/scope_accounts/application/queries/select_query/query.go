package select_query

import (
	"context"
	"financo/core/domain/queries"
	"financo/core/scope_accounts/domain/repositories"
	"financo/core/scope_accounts/domain/requests"
	"financo/core/scope_accounts/domain/responses"
)

type query struct {
	req  requests.Select
	repo repositories.SelectAccountRepository
}

func New(req requests.Select, repo repositories.SelectAccountRepository) queries.Query[[]responses.Select] {
	return &query{
		req:  req,
		repo: repo,
	}
}

func (q *query) Find(ctx context.Context) ([]responses.Select, error) {
	var (
		res []responses.Select
	)

	res, err := q.repo.Find(ctx, repositories.SelectAccountRepositoryFilter{
		Kinds:    q.req.Kinds,
		Archived: q.req.Archived,
	})
	if err != nil {
		return res, err
	}

	return res, nil
}

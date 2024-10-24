package preview_query

import (
	"context"
	"financo/core/scope_accounts/domain/repositories"
	"financo/core/scope_accounts/domain/requests"
	"financo/core/scope_accounts/domain/responses"
	"financo/server/types/queries"
)

type query struct {
	req  requests.Preview
	repo repositories.PreviewAccountRepository
}

func New(req requests.Preview, repo repositories.PreviewAccountRepository) queries.Query[[]responses.Preview] {
	return &query{
		req:  req,
		repo: repo,
	}
}

func (q *query) Find(ctx context.Context) ([]responses.Preview, error) {
	var (
		res []responses.Preview
	)

	res, err := q.repo.Find(ctx, repositories.PreviewAccountRepositoryFilter{
		Kinds:    q.req.Kinds,
		Archived: q.req.Archived,
	})
	if err != nil {
		return res, err
	}

	return res, nil
}

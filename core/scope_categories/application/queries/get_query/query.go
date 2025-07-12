package show_query

import (
	"context"
	"financo/core/domain/queries"
	"financo/core/scope_categories/domain/repositories"
	"financo/core/scope_categories/domain/requests"
	"financo/core/scope_categories/domain/responses"
)

type query struct {
	req  requests.Show
	repo repositories.CategoryRepository
}

func New(req requests.Show, repo repositories.CategoryRepository) queries.Query[responses.Listed] {
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

	res = responses.NewListedFromCategoryRecord(record)

	return res, nil
}

package list_query

import (
	"context"
	"financo/core/domain/queries"
	"financo/core/scope_categories/domain/filters"
	"financo/core/scope_categories/domain/repositories"
	"financo/core/scope_categories/domain/requests"
	"financo/core/scope_categories/domain/responses"
	"financo/models/account"
)

type query struct {
	req  requests.List
	repo repositories.CategoriesRepository
}

func New(req requests.List, repo repositories.CategoriesRepository) queries.Query[[]responses.Listed] {
	return &query{
		req:  req,
		repo: repo,
	}
}

func (q *query) Find(ctx context.Context) ([]responses.Listed, error) {
	res := make([]responses.Listed, 0, 15)

	records, err := q.repo.Where(ctx, filters.Categories{
		Kinds: []account.Kind{account.Expense, account.Income},
	})
	if err != nil {
		return res, err
	}

	for i := 0; i < len(records); i++ {
		res = append(
			res,
			responses.NewListedFromCategoryRecord(records[i]),
		)
	}

	return res, nil
}

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
		Kinds: []account.Kind{account.ExternalExpense, account.ExternalIncome},
	})
	if err != nil {
		return res, err
	}

	for i := 0; i < len(records); i++ {
		r := responses.Listed{
			ID:          records[i].Account.ID,
			Kind:        records[i].Account.Kind,
			Currency:    records[i].Account.Currency,
			Name:        records[i].Account.Name,
			Description: records[i].Account.Description,
			Color:       records[i].Account.Color,
			Icon:        records[i].Account.Icon,
			ArchivedAt:  records[i].Account.ArchivedAt,
			DeletedAt:   records[i].Account.DeletedAt,
			CreatedAt:   records[i].Account.CreatedAt,
			UpdatedAt:   records[i].Account.UpdatedAt,
			Children:    make([]responses.ListedChild, 0, len(records[i].Children)),
		}

		for j := 0; j < len(records[i].Children); j++ {
			r.Children = append(r.Children, responses.ListedChild{
				ID:          records[i].Children[j].ID,
				Kind:        records[i].Children[j].Kind,
				Currency:    records[i].Children[j].Currency,
				Name:        records[i].Children[j].Name,
				Description: records[i].Children[j].Description,
				Color:       records[i].Children[j].Color,
				Icon:        records[i].Children[j].Icon,
				ArchivedAt:  records[i].Children[j].ArchivedAt,
				DeletedAt:   records[i].Children[j].DeletedAt,
				CreatedAt:   records[i].Children[j].CreatedAt,
				UpdatedAt:   records[i].Children[j].UpdatedAt,
			})
		}

		res = append(res, r)
	}

	return res, nil
}

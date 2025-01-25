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
			ID:           records[i].Parent.ID,
			Kind:         records[i].Parent.Kind,
			Currency:     records[i].Parent.Currency,
			Name:         records[i].Parent.Name,
			Description:  records[i].Parent.Description,
			Color:        records[i].Parent.Color,
			Icon:         records[i].Parent.Icon,
			ArchivedAt:   records[i].Parent.ArchivedAt,
			DeletedAt:    records[i].Parent.DeletedAt,
			CreatedAt:    records[i].Parent.CreatedAt,
			UpdatedAt:    records[i].Parent.UpdatedAt,
			Transactions: records[i].Parent.DynamicData.Transactions,
			Children:     make([]responses.ListedChild, 0, len(records[i].Children)),
		}

		for j := 0; j < len(records[i].Children); j++ {
			r.Children = append(r.Children, responses.ListedChild{
				ID:           records[i].Children[j].ID,
				Kind:         records[i].Children[j].Kind,
				Currency:     records[i].Children[j].Currency,
				Name:         records[i].Children[j].Name,
				Description:  records[i].Children[j].Description,
				Color:        records[i].Children[j].Color,
				Icon:         records[i].Children[j].Icon,
				ArchivedAt:   records[i].Children[j].ArchivedAt,
				DeletedAt:    records[i].Children[j].DeletedAt,
				CreatedAt:    records[i].Children[j].CreatedAt,
				UpdatedAt:    records[i].Children[j].UpdatedAt,
				Transactions: records[i].Children[j].DynamicData.Transactions,
			})
		}

		res = append(res, r)
	}

	return res, nil
}

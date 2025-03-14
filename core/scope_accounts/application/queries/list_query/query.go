package list_query

import (
	"context"
	"financo/core/domain/queries"
	"financo/core/scope_accounts/domain/filters"
	"financo/core/scope_accounts/domain/repositories"
	"financo/core/scope_accounts/domain/requests"
	"financo/core/scope_accounts/domain/responses"
	"financo/models/account"
)

type query struct {
	req  requests.List
	repo repositories.AccountsRepository
}

func New(req requests.List, repo repositories.AccountsRepository) queries.Query[[]responses.Listed] {
	return &query{
		req:  req,
		repo: repo,
	}
}

func (q *query) Find(ctx context.Context) ([]responses.Listed, error) {
	var res = make([]responses.Listed, 0, 10)

	accounts, err := q.repo.Where(ctx, filters.Accounts{
		Kinds: []account.Kind{
			account.Capital,
			account.Savings,
			account.DebtCredit,
			account.Debt,
		},
	})
	if err != nil {
		return res, err
	}

	for i := 0; i < len(accounts); i++ {
		res = append(res, responses.AccountRecordToListed(accounts[i]))
	}

	return res, nil
}

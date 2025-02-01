package accounts_query

import (
	"context"
	"financo/core/domain/queries"
	"financo/core/scope_transactions/domain/repositories"
	"financo/core/scope_transactions/domain/requests"
	"financo/core/scope_transactions/domain/responses"
)

type query struct {
	req      requests.Accounts
	accounts repositories.AccountsRepository
}

func New(
	req requests.Accounts,
	accounts repositories.AccountsRepository,
) queries.Query[[]responses.Account] {
	return &query{
		req:      req,
		accounts: accounts,
	}
}

func (q *query) Find(ctx context.Context) ([]responses.Account, error) {
	res := make([]responses.Account, 0, 30)

	records, err := q.accounts.Where(ctx)
	if err != nil {
		return res, err
	}

	for i := 0; i < len(records); i++ {
		res = append(res, responses.RecordToAccount(records[i]))
	}

	return res, nil
}

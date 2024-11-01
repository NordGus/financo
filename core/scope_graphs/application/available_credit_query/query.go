package available_credit_query

import (
	"context"
	"financo/core/domain/queries"
	"financo/core/scope_graphs/domain/repositories"
	"financo/core/scope_graphs/domain/requests"
	"financo/core/scope_graphs/domain/responses"
	"financo/lib/currency"
)

type query struct {
	req          requests.AvailableCredit
	accountsRepo repositories.CreditAccounts
	repo         repositories.BalanceForKinds
}

func New(
	req requests.AvailableCredit,
	accountsRepo repositories.CreditAccounts,
	repo repositories.BalanceForKinds,
) queries.Query[[]responses.Summary] {
	return &query{
		req:          req,
		accountsRepo: accountsRepo,
		repo:         repo,
	}
}

func (q *query) Find(ctx context.Context) ([]responses.Summary, error) {
	var (
		capital = make(map[currency.Type]int64, 0)

		res []responses.Summary
	)

	accounts, err := q.accountsRepo.Find(ctx)
	if err != nil {
		return res, err
	}

	res, err = q.repo.Find(ctx, q.req.ToFilter())
	if err != nil {
		return res, err
	}

	for i := 0; i < len(accounts); i++ {
		capital[accounts[i].Currency] += accounts[i].Capital
	}

	for i := 0; i < len(res); i++ {
		res[i].Amount += capital[res[i].Currency]

		for j := 0; j < len(res[i].Series); j++ {
			res[i].Series[j].Amount = -res[i].Series[j].Amount
		}
	}

	return res, nil
}

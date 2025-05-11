package pending_query

import (
	"context"
	"financo/core/domain/queries"
	"financo/core/scope_transactions/domain/filters"
	"financo/core/scope_transactions/domain/repositories"
	"financo/core/scope_transactions/domain/requests"
	"financo/core/scope_transactions/domain/responses"
)

type query struct {
	req          requests.Executed
	transactions repositories.TransactionsRepository
}

func New(
	req requests.Executed,
	transactions repositories.TransactionsRepository,
) queries.Query[[]responses.Detailed] {
	return &query{
		req:          req,
		transactions: transactions,
	}
}

func (q *query) Find(ctx context.Context) ([]responses.Detailed, error) {
	res := make([]responses.Detailed, 0, 50)

	records, err := q.transactions.PendingWhere(ctx, filters.Pending{
		AccountIDs:  q.req.AccountIDs,
		CategoryIDs: q.req.CategoryIDs,
	})
	if err != nil {
		return res, err
	}

	for i := 0; i < len(records); i++ {
		res = append(res, responses.RecordToDetailed(records[i]))
	}

	return res, err
}

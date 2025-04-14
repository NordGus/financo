package transaction_query

import (
	"context"
	"financo/core/domain/queries"
	"financo/core/scope_transactions/domain/repositories"
	"financo/core/scope_transactions/domain/requests"
	"financo/core/scope_transactions/domain/responses"
)

type query struct {
	req         requests.Detailed
	transaction repositories.TransactionRepository
}

func New(
	req requests.Detailed,
	transactions repositories.TransactionRepository,
) queries.Query[responses.Detailed] {
	return &query{
		req:         req,
		transaction: transactions,
	}
}

func (q *query) Find(ctx context.Context) (responses.Detailed, error) {
	var res responses.Detailed

	record, err := q.transaction.Find(ctx, q.req.ID)
	if err != nil {
		return res, err
	}

	res = responses.RecordToDetailed(record)

	return res, nil
}

// Package get_query contains the business logic to retrieve an active
// [savings_goal.Record] from the system.
package get_query

import (
	"context"
	"financo/core/domain/queries"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/core/scope_savings_goals/domain/requests"
	"financo/core/scope_savings_goals/domain/responses"
	"financo/core/scope_savings_goals/infrastructure/lock"
)

type query struct {
	req   requests.Show
	goals repositories.SavingsGoal
}

func New(req requests.Show, goals repositories.SavingsGoal) queries.Query[responses.Detailed] {
	return &query{
		req:   req,
		goals: goals,
	}
}

func (q *query) Find(ctx context.Context) (responses.Detailed, error) {
	var res responses.Detailed

	// Locking to prevent weird behavior
	lock.GlobalLock().RLock()
	defer lock.GlobalLock().RUnlock() // this one can be deferred because is just a read lock

	record, err := q.goals.Find(ctx, q.req.ID)
	if err != nil {
		return res, err
	}

	res = responses.SavingsGoalRecordToDetailed(record)

	return res, nil
}

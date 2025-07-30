package list_query

import (
	"context"
	"financo/core/domain/queries"
	"financo/core/scope_savings_goals/domain/filters"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/core/scope_savings_goals/domain/requests"
	"financo/core/scope_savings_goals/domain/responses"
	"financo/core/scope_savings_goals/infrastructure/lock"
	"financo/lib/currency"
	"financo/models/achievement/savings_goal"
	"log"
)

type query struct {
	req   requests.List
	goals repositories.SavingsGoalsRepository
}

func New(req requests.List, goals repositories.SavingsGoalsRepository) queries.Query[[]responses.Listed] {
	return &query{
		req:   req,
		goals: goals,
	}
}

func (q *query) Find(ctx context.Context) ([]responses.Listed, error) {
	var (
		goals = make(map[currency.Type][]savings_goal.Record, 7)
		res   = make([]responses.Listed, 0, 7)
	)

	// Locking to prevent weird behavior
	lock.GlobalLock().RLock()
	defer lock.GlobalLock().RUnlock() // this one can be deferred because is just a read lock

	log.Println("Query")

	// records are assumed to be ordered by position in ascending order
	records, err := q.goals.Where(ctx, filters.SavingsGoals{
		Currencies: filters.FilterSavingsGoalCurrency(q.req.Currencies),
	})
	if err != nil {
		return res, err
	}

	log.Println("Query")

	for _, record := range records {
		if _, ok := goals[record.Settings.Currency]; ok {
			goals[record.Settings.Currency] = append(goals[record.Settings.Currency], record)

			continue
		}

		goals[record.Settings.Currency] = make([]savings_goal.Record, 0, 15)
		goals[record.Settings.Currency] = append(goals[record.Settings.Currency], record)
	}

	log.Println("Query")

	for curr, records := range goals {
		res = append(res, responses.SavingsGoalRecordsToListed(curr, records))
	}

	log.Println("Query END")

	for _, r := range res {
		log.Println(r.Currency)
		for _, goal := range r.Goals {
			log.Println(goal)
		}
	}

	return res, nil
}

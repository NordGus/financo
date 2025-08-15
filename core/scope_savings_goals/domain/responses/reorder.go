package responses

import (
	"financo/lib/currency"
	"financo/models/achievement/savings_goal"
)

func NewReordered(curr currency.Type, r []savings_goal.Record) Listed {
	goals := make([]Detailed, 0, len(r))

	for _, record := range r {
		goals = append(goals, SavingsGoalRecordToDetailed(record))
	}

	return Listed{
		Currency: curr,
		Goals:    goals,
	}
}

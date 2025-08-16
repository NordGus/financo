package responses

import (
	"financo/lib/currency"
	"financo/models/achievement/savings_goal"
)

type Listed struct {
	Currency currency.Type `json:"currency"`
	Goals    []Detailed    `json:"goals"`
}

func SavingsGoalRecordsToListed(curr currency.Type, r []savings_goal.Record) Listed {
	goals := make([]Detailed, 0, len(r))

	for _, record := range r {
		goals = append(goals, SavingsGoalRecordToDetailed(record))
	}

	return Listed{
		Currency: curr,
		Goals:    goals,
	}
}

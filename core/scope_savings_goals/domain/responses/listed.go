package responses

import (
	"financo/lib/currency"
	"financo/models/achievement/savings_goal"
)

type Listed struct {
	Currency currency.Type         `json:"currency"`
	Goals    []savings_goal.Record `json:"goals"`
}

func SavingsGoalRecordsToListed(curr currency.Type, r []savings_goal.Record) Listed {
	return Listed{
		Currency: curr,
		Goals:    r,
	}
}

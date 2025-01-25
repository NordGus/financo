package responses

import (
	"financo/lib/currency"
	"financo/models/achievement/savings_goal"
)

type Reordered struct {
	Currency currency.Type         `json:"currency"`
	Goals    []savings_goal.Record `json:"goals"`
}

func NewReordered(curr currency.Type, r []savings_goal.Record) Reordered {
	return Reordered{
		Currency: curr,
		Goals:    r,
	}
}

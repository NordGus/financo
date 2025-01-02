package responses

import (
	"financo/lib/currency"
	"financo/models/achievement/savings_goal"
)

type Active struct {
	Currency currency.Type         `json:"currency"`
	Goals    []savings_goal.Record `json:"goals"`
}

func NewActive(curr currency.Type, r []savings_goal.Record) Active {
	return Active{
		Currency: curr,
		Goals:    r,
	}
}

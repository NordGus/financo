package responses

import (
	"financo/lib/currency"
	"financo/models/achievement/savings_goal"
)

type List struct {
	Currency currency.Type         `json:"currency"`
	Goals    []savings_goal.Record `json:"goals"`
}

func NewListed(curr currency.Type, r []savings_goal.Record) List {
	return List{
		Currency: curr,
		Goals:    r,
	}
}

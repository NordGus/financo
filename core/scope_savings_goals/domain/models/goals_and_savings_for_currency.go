package models

import (
	"financo/lib/currency"
	"financo/models/achievement/savings_goal"
)

type GoalsAndSavingsForCurrency struct {
	Currency currency.Type
	Savings  int64
	Goals    []savings_goal.Record
}

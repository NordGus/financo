package response

import (
	"financo/lib/currency"
	"financo/models/achievement/savings_goal"
)

type Active struct {
	Currency currency.Type         `json:"currency"`
	Goals    []savings_goal.Record `json:"goals"`
}

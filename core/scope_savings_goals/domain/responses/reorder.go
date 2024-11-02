package responses

import (
	"financo/lib/currency"
	"financo/models/achievement/savings_goal"
)

type Reorder struct {
	Currency currency.Type         `json:"currency"`
	Goals    []savings_goal.Record `json:"goals"`
}

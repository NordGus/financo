package response

import (
	"financo/server/types/records/achievement/savings_goal"
	"financo/server/types/shared/currency"
)

type Active struct {
	Currency currency.Type         `json:"currency"`
	Goals    []savings_goal.Record `json:"goals"`
}

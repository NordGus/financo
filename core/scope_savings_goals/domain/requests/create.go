package requests

import (
	"financo/lib/currency"
	"financo/lib/nullable"
	"financo/models/achievement"
	"financo/models/achievement/savings_goal"
	"time"
)

type Create struct {
	Name        string                `json:"name"`
	Description nullable.Type[string] `json:"description"`
	Currency    currency.Type         `json:"currency"`
	Target      int64                 `json:"target"`
}

func (r Create) ToRecord(timestamp time.Time) savings_goal.Record {
	return savings_goal.Record{
		ID:          -1,
		Kind:        achievement.SavingsGoal,
		Name:        r.Name,
		Description: r.Description,
		Settings: savings_goal.Settings{
			Position: -1,
			Target:   r.Target,
			Saved:    0,
			Currency: r.Currency,
		},
		UpdatedAt: timestamp,
		CreatedAt: timestamp,
	}
}

package responses

import (
	"financo/lib/currency"
	"financo/lib/nullable"
	"financo/models/achievement/savings_goal"
	"time"
)

type MarkedAsAchieved struct {
	ID          int64                 `json:"id"`
	Name        string                `json:"name"`
	Description nullable.Type[string] `json:"description"`
	Currency    currency.Type         `json:"currency"`
	Target      int64                 `json:"target"`
	At          time.Time             `json:"at"`
}

func NewMarkedAsAchieved(r savings_goal.Record) MarkedAsAchieved {
	return MarkedAsAchieved{
		ID:          r.ID,
		Name:        r.Name,
		Description: r.Description,
		Currency:    r.Settings.Currency,
		Target:      r.Settings.Target,
		At:          r.AchievedAt.Val,
	}
}

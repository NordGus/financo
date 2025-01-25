package responses

import (
	"financo/lib/currency"
	"financo/models/achievement/savings_goal"
)

type Updated struct {
	ID       int64         `json:"id"`
	Name     string        `json:"name"`
	Currency currency.Type `json:"currency"`
	Target   int64         `json:"target"`
}

func NewUpdated(r savings_goal.Record) Updated {
	return Updated{
		ID:       r.ID,
		Name:     r.Name,
		Currency: r.Settings.Currency,
		Target:   r.Settings.Target,
	}
}

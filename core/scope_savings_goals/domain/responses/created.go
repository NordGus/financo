package responses

import (
	"financo/lib/currency"
	"financo/models/achievement/savings_goal"
)

type Created struct {
	ID       int64         `json:"id"`
	Name     string        `json:"name"`
	Currency currency.Type `json:"currency"`
	Target   int64         `json:"target"`
}

func NewCreated(r savings_goal.Record) Created {
	return Created{
		ID:       r.ID,
		Name:     r.Name,
		Currency: r.Settings.Currency,
		Target:   r.Settings.Target,
	}
}

package responses

import (
	"financo/lib/currency"
	"financo/models/achievement/savings_goal"
)

type Created struct {
	Name     string        `json:"name"`
	Currency currency.Type `json:"currency"`
	Target   int64         `json:"target"`
}

func RecordToCreated(r savings_goal.Record) Created {
	return Created{
		Name:     r.Name,
		Currency: r.Settings.Currency,
		Target:   r.Settings.Target,
	}
}

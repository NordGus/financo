package responses

import (
	"financo/lib/currency"
	"financo/lib/nullable"
	"financo/models/achievement/savings_goal"
	"time"
)

type Detailed struct {
	ID          int64                 `json:"id"`
	Name        string                `json:"name"`
	Description nullable.Type[string] `json:"description"`
	Position    int16                 `json:"position"`
	Target      int64                 `json:"target"`
	Saved       int64                 `json:"saved"`
	Currency    currency.Type         `json:"currency"`
	CreatedAt   time.Time             `json:"createdAt"`
	UpdatedAt   time.Time             `json:"updatedAt"`
}

func SavingsGoalRecordToDetailed(r savings_goal.Record) Detailed {
	return Detailed{
		ID:          r.ID,
		Name:        r.Name,
		Description: r.Description,
		Position:    r.Settings.Position,
		Target:      r.Settings.Target,
		Saved:       r.Settings.Saved,
		Currency:    r.Settings.Currency,
		CreatedAt:   r.CreatedAt,
		UpdatedAt:   r.UpdatedAt,
	}
}

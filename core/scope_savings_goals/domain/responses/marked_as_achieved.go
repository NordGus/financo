package responses

import (
	"financo/lib/nullable"
	"financo/models/achievement/savings_goal"
)

type MarkedAsAchieved struct {
	ID          int64                 `json:"id"`
	Name        string                `json:"name"`
	Description nullable.Type[string] `json:"description"`
}

func RecordToMarkedAsAchieved(r savings_goal.Record) MarkedAsAchieved {
	return MarkedAsAchieved{
		ID:          r.ID,
		Name:        r.Name,
		Description: r.Description,
	}
}

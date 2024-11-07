package responses

import (
	"financo/models/achievement/savings_goal"
)

type Deleted struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

func RecordToDeleted(r savings_goal.Record) Deleted {
	return Deleted{
		ID:   r.ID,
		Name: r.Name,
	}
}

package messages

import "financo/models/achievement/savings_goal"

type Deleted struct {
	Record savings_goal.Record
}

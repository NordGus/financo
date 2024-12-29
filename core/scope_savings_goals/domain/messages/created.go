package messages

import "financo/models/achievement/savings_goal"

type Created struct {
	Record savings_goal.Record
}

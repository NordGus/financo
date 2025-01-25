package messages

import "financo/models/achievement/savings_goal"

type MarkedAsAchieved struct {
	Record savings_goal.Record
}

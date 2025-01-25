package messages

import "financo/models/achievement/savings_goal"

type Updated struct {
	Current  savings_goal.Record
	Previous savings_goal.Record
}

package filters

import (
	"financo/models/achievement"
	"time"
)

type Milestones struct {
	From time.Time
	To   time.Time

	Kinds []achievement.Kind
}

func FilterMilestoneKinds(kinds []achievement.Kind) []achievement.Kind {
	var (
		out      = make([]achievement.Kind, 0, 1)
		accepted = map[achievement.Kind]bool{
			achievement.SavingsGoal: true,
		}
	)

	for i := range kinds {
		if accepted[kinds[i]] {
			out = append(out, kinds[i])
		}
	}

	if len(out) == 0 {
		out = append(out, achievement.SavingsGoal)
	}

	return out
}

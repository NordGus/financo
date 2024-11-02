package savings_goal

import (
	"financo/models/achievement"
	"time"
)

type Record achievement.Record[Settings]

// KindValue returns [Record]'s Kind so it implements the
// [achievement.Milestone] interface
func (r Record) KindValue() achievement.Kind {
	return r.Kind
}

// AchievedAtValue returns [Record]'s AchievedAt value so it implements the
// [achievement.Milestone] interface
func (r Record) AchievedAtValue() time.Time {
	t := r.AchievedAt.Val

	return time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, t.Location())
}

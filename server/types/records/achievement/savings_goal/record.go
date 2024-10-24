package savings_goal

import (
	"financo/core/domain/records/achievement"
	"time"
)

type Record achievement.Record[Settings]

func (r Record) GetKind() achievement.Kind {
	return r.Kind
}

func (r Record) AchieveTime() time.Time {
	return r.AchievedAt.Val
}

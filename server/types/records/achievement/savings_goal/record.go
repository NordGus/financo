package savings_goal

import (
	"encoding/json"
	"financo/server/types/records/achievement"
	"time"
)

type Record achievement.Record[Settings]

func (r Record) GetKind() achievement.Kind {
	return r.Kind
}

func (r Record) MarshalJSON() ([]byte, error) {
	return json.Marshal(r)
}

func (r Record) AchieveTime() time.Time {
	return r.AchievedAt.Val
}

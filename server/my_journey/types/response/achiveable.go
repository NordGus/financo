package response

import (
	"financo/server/types/records/achievement"
	"time"
)

type Achievable interface {
	GetKind() achievement.Kind
	AchieveTime() time.Time
}

package response

import (
	"financo/models/achievement"
	"time"
)

type Achievable interface {
	GetKind() achievement.Kind
	AchieveTime() time.Time
}

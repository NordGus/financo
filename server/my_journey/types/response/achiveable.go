package response

import (
	"financo/core/domain/records/achievement"
	"time"
)

type Achievable interface {
	GetKind() achievement.Kind
	AchieveTime() time.Time
}

package responses

import (
	"financo/models/achievement"
	"time"
)

type Milestone struct {
	Timestamp    time.Time
	Achievements []achievement.Milestone
}

package responses

import (
	"financo/models/achievement"
	"time"
)

type Milestone struct {
	Timestamp    time.Time               `json:"timestamp"`
	Achievements []achievement.Milestone `json:"achievements"`
}

package achievement

import "time"

// Milestone interface represents [Record] that has been achieved,
// meaning that AchievedAt is a not nil value
type Milestone interface {
	KindValue() Kind
	AchievedAtValue() time.Time
}

package filters

import "time"

const (
	fromDefaultDaysOffset = 30
)

func to() time.Time {
	return time.Now().UTC()
}

func from() time.Time {
	return time.Now().UTC().AddDate(0, 0, -fromDefaultDaysOffset)
}

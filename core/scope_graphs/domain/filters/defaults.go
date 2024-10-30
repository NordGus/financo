package filters

import "time"

const FromDefaultDaysOffset = 30

func ToDefault() time.Time {
	return time.Now().UTC()
}

func FromDefault() time.Time {
	return time.Now().UTC().AddDate(0, -FromDefaultDaysOffset, 0)
}

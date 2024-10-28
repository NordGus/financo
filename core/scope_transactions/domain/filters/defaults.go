package filters

import "time"

const DefaultYearsOffset = 200

func FromDefault() time.Time {
	return time.Now().UTC().AddDate(-DefaultYearsOffset, 0, 0)
}

func ToDefault() time.Time {
	return time.Now().UTC().AddDate(DefaultYearsOffset, 0, 0)
}

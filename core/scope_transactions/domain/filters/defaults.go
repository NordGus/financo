package filters

import "time"

const DefaultYearsOffset = 200

func FromDefault() time.Time {
	return time.Now().UTC().AddDate(-DefaultYearsOffset, 0, 0)
}

func ToDefault() time.Time {
	return time.Now().UTC().AddDate(DefaultYearsOffset, 0, 0)
}

func DateToLimit(date time.Time, from bool) time.Time {
	if from {
		return time.Date(date.Year(), date.Month(), date.Day(), 0, 0, 0, 0, date.Location())
	}

	return time.Date(date.Year(), date.Month(), date.Day(), 24, 0, 0, 0, date.Location()).Add(time.Millisecond * -1)
}

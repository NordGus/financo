// Package date contains a custom implementation of time.Time that have a custom
// json parser to work with dates only.
package date

import (
	"encoding/json"
	"errors"
	"time"
)

// Type is an alias of [time.Time] that works on date only time.Time for json
// serialization.
type Type time.Time

func New(t time.Time) Type {
	return Type(t)
}

func (t *Type) UnmarshalJSON(b []byte) error {
	var s string

	if err := json.Unmarshal(b, &s); err != nil {
		return errors.Join(
			errors.New("date: failed to parse date intermediate representation"),
			err,
		)
	}

	date, err := time.Parse(time.DateOnly, s)
	if err != nil {
		return errors.Join(
			errors.New("date: failed to parse time.Time from intermediate representation"),
			err,
		)
	}

	*t = Type(date)

	return nil
}

func (t Type) MarshalJSON() ([]byte, error) {
	out := t.ToTime()
	s := out.Format(time.DateOnly)

	return json.Marshal(s)
}

func (t Type) ToTime() time.Time {
	return time.Time(t)
}

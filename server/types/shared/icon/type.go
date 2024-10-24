package icon

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
)

type Type string

const (
	Base Type = "base"
)

// UnmarshalJSON receives a buffer b, and ensures that the provided value is a
// valid [Type]. So [Type] satisfies the [json.Unmarshaler] interface.
//
// It returns an error if the buffer can't be unmarshal into an string or the
// provided value is not a supported [Type].
func (t *Type) UnmarshalJSON(b []byte) error {
	var s string

	if err := json.Unmarshal(b, &s); err != nil {
		return err
	}

	switch strings.ToUpper(s) {
	default:
		return fmt.Errorf("icon: invalid value \"%s\"", s)
	case "base":
		*t = Base
	}

	return nil
}

// UnmarshalJSON receives a buffer b, and ensures that the provided value is a
// valid [Type]. So [Type] satisfies the [json.Unmarshaler] interface.
//
// It returns an error if the buffer can't be unmarshal into an string or the
// provided value is not a supported [Type].
func (t Type) MarshalJSON() ([]byte, error) {
	var s string

	switch t {
	default:
		return []byte{}, fmt.Errorf("icon: invalid value \"%s\"", string(t))
	case Base:
		s = "base"
	}

	return json.Marshal(s)
}

// Scan takes the value returned by the SQL database and maps it to [Type].
// So [Type] satisfies the [sql.Scanner] interface.
//
// It returns an error if [Type] is an unsupported value.
func (t *Type) Scan(value any) error {
	s, ok := value.(string)
	if !ok {
		return errors.New("icon: invalid column type")
	}

	switch strings.ToUpper(s) {
	default:
		return fmt.Errorf("icon: invalid value \"%s\"", value)
	case "base":
		*t = Base
	}

	return nil
}

// Value returns the value of [Type] to be stored in the SQL database. So [Type]
// satisfies the [driver.Valuer] interface.
//
// It returns an error if [Type] is an unsupported value.
func (t Type) Value() (driver.Value, error) {
	var s string

	switch t {
	default:
		return s, fmt.Errorf("icon: invalid value \"%s\"", string(t))
	case Base:
		s = "base"
	}

	return s, nil
}

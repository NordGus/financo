package color

import (
	"database/sql/driver"
	"errors"
)

type Type string

// Scan takes the value returned by the SQL database and maps it to [Type].
// So [Type] satisfies the [sql.Scanner] interface.
//
// It returns an error if [Type] is an unsupported value.
func (t *Type) Scan(value any) error {
	s, ok := value.(string)
	if !ok {
		return errors.New("color: invalid column type")
	}

	*t = Type(s)

	return nil
}

// Value returns the value of [Type] to be stored in the SQL database. So [Type]
// satisfies the [driver.Valuer] interface.
//
// It returns an error if [Type] is an unsupported value.
func (t Type) Value() (driver.Value, error) {
	return string(t), nil
}

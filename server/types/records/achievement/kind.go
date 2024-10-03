package achievement

import (
	"database/sql/driver"
	"fmt"
	"strings"
)

type Kind string

const (
	SavingsGoal Kind = "savings_goal"
)

// Scan takes the value returned by the SQL database and maps it to
// [Kind]. So [Kind] satisfies the [sql.Scanner] interface.
//
// It returns an error if [Kind] is an unsupported value.
func (k *Kind) Scan(value string) error {
	switch strings.ToLower(value) {
	default:
		return fmt.Errorf("achievement: invalid achievement kind \"%s\"", value)
	case "savings_goal":
		*k = SavingsGoal
	}

	return nil
}

// Value returns the value of [Kind] to be stored in the SQL database. So [Kind]
// satisfies the [driver.Valuer] interface.
//
// It returns an error if [Kind] is an unsupported value.
func (k Kind) Value() (driver.Value, error) {
	var s string

	switch k {
	default:
		return s, fmt.Errorf("account: invalid account kind \"%s\"", string(k))
	case SavingsGoal:
		s = "savings_goal"
	}

	return s, nil
}

package achievement

import (
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

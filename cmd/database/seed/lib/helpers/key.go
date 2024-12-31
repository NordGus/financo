package helpers

import (
	"financo/lib/currency"
	"fmt"
)

func SavingsGoalMapKey(name string, curr currency.Type) string {
	return fmt.Sprintf("%s:%s", name, curr)
}

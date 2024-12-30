package helpers

import (
	"financo/lib/currency"
	"fmt"
)

func MapKey(name string, curr currency.Type) string {
	return fmt.Sprintf("%s:%s", name, curr)
}

package helpers

import (
	"financo/lib/currency"
	"fmt"
)

func SavingsGoalMapKey(name string, curr currency.Type) string {
	return fmt.Sprintf("%s:%s", name, curr)
}

func AccountMapKey(key string) string {
	return fmt.Sprintf("account.%s", key)
}

func CategoryMapKey(key string) string {
	return fmt.Sprintf("category.%s", key)
}

func ChildCategoryMapKey(parentKey string, key string) string {
	return fmt.Sprintf("category.%s.%s", parentKey, key)
}

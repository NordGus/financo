package requests

import (
	"financo/lib/currency"
	"financo/lib/nullable"
)

type Create struct {
	Name        string                `json:"name"`
	Description nullable.Type[string] `json:"description"`
	Currency    currency.Type         `json:"currency"`
	Target      int64                 `json:"target"`
}

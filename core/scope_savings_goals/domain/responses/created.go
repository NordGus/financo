package responses

import "financo/lib/currency"

type Created struct {
	Name     string        `json:"name"`
	Currency currency.Type `json:"currency"`
	Target   int64         `json:"target"`
}

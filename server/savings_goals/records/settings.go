package records

import (
	"financo/server/types/shared/currency"
)

type Settings struct {
	Position int16         `json:"position"` // unique
	Target   int64         `json:"target"`
	Saved    int64         `json:"saved"`
	Currency currency.Type `json:"currency"`
}

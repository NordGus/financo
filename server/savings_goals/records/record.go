package records

import (
	"financo/server/types/records/achievement"
	"financo/server/types/shared/currency"
)

type Record achievement.Record[Settings]

type Settings struct {
	Position int16         `json:"position"` // unique
	Target   int64         `json:"target"`
	Saved    int64         `json:"saved"`
	Currency currency.Type `json:"currency"`
}

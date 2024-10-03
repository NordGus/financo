package records

import (
	"encoding/json"
	"financo/server/types/shared/currency"
)

type Settings struct {
	Position int16         `json:"position"` // unique
	Target   int64         `json:"target"`
	Saved    int64         `json:"saved"`
	Currency currency.Type `json:"currency"`
}

// Scan takes the json value returned by the SQL database and maps it to
// [Settings]. So [Settings] satisfies the [sql.Scanner] interface.
//
// It returns an error if [Settings] can't be mapped to the json given by the
// SQL database.
func (s *Settings) Scan(value []byte) error {

	if err := json.Unmarshal(value, &s); err != nil {
		return err
	}

	return nil
}

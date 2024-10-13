package savings_goal

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"financo/server/types/shared/currency"
	"fmt"
)

// Settings is the struct representing the json stored inside the settings column
// of every Achievement record with kind "achievement_goal".
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
func (s *Settings) Scan(value any) error {
	data, ok := value.([]uint8)
	if !ok {
		return errors.New("savings_goal: invalid column type")
	}

	if err := json.Unmarshal(data, s); err != nil {
		return errors.Join(fmt.Errorf("savings_goals: records: settings: can't be mapped"), err)
	}

	return nil
}

// Value returns the json encoding of [Setting] to be stored in the SQL database.
// So [Settings] satisfies the [driver.Valuer] interface.
//
// It returns an error if [Settings] can't be marshaled into json.
func (s Settings) Value() (driver.Value, error) {
	b, err := json.Marshal(&s)
	if err != nil {
		return b, errors.Join(fmt.Errorf("savings_goals: records: settings: can't be marshaled"), err)
	}

	return []uint8(b), nil
}

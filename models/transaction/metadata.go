package transaction

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
)

type Metadata struct {
	Kind Kind `json:"kind"`
}

// Scan takes the json value returned by the SQL database and maps it to
// [Metadata]. So [Metadata] satisfies the [sql.Scanner] interface.
//
// It returns an error if [Metadata] can't be mapped to the json given by the
// SQL database.
func (s *Metadata) Scan(value any) error {
	data, ok := value.([]uint8)
	if !ok {
		return errors.New("transaction: invalid column type")
	}

	if err := json.Unmarshal(data, s); err != nil {
		return errors.Join(fmt.Errorf("transaction: records: settings: can't be mapped"), err)
	}

	return nil
}

// Value returns the json encoding of [Metadata] to be stored in the SQL
// database. So [Metadata] satisfies the [driver.Valuer] interface.
//
// It returns an error if [Metadata] can't be marshaled into json.
func (s Metadata) Value() (driver.Value, error) {
	b, err := json.Marshal(&s)
	if err != nil {
		return b, errors.Join(fmt.Errorf("transaction: records: settings: can't be marshaled"), err)
	}

	return []uint8(b), nil
}

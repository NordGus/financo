package account

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"financo/lib/nullable"
	"fmt"
	"time"
)

// DynamicData represent data than will be calculated async from other parts of
// the application or added as additional fields for configuration.
type DynamicData struct {
	Main         bool               `json:"main"`
	Balance      int64              `json:"balance"`
	History      HistoryDynamicData `json:"history"`
	Transactions int64              `json:"transactions"`
}

// HistoryDynamicData represent contains the data needed to create the account's
// history
type HistoryDynamicData struct {
	At      nullable.Type[time.Time] `json:"at"`
	Balance nullable.Type[int64]     `json:"balance"`
}

// Scan takes the json value returned by the SQL database and maps it to
// [DynamicData]. So [DynamicData] satisfies the [sql.Scanner] interface.
//
// It returns an error if [DynamicData] can't be mapped to the json given by the
// SQL database.
func (s *DynamicData) Scan(value any) error {
	data, ok := value.([]uint8)
	if !ok {
		return errors.New("account: invalid column type")
	}

	if err := json.Unmarshal(data, s); err != nil {
		return errors.Join(fmt.Errorf("account: records: settings: can't be mapped"), err)
	}

	return nil
}

// Value returns the json encoding of [DynamicData] to be stored in the SQL
// database. So [DynamicData] satisfies the [driver.Valuer] interface.
//
// It returns an error if [DynamicData] can't be marshaled into json.
func (s DynamicData) Value() (driver.Value, error) {
	b, err := json.Marshal(&s)
	if err != nil {
		return b, errors.Join(fmt.Errorf("account: records: settings: can't be marshaled"), err)
	}

	return []uint8(b), nil
}

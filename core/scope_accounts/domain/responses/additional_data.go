package responses

import (
	"financo/lib/nullable"
	"time"
)

type AdditionalData struct {
	Main         bool    `json:"main"`
	Balance      int64   `json:"balance"`
	History      History `json:"history"`
	Transactions int64   `json:"transactions"`
}

type History struct {
	At      nullable.Type[time.Time] `json:"at"`
	Balance nullable.Type[int64]     `json:"balance"`
}

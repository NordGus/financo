package response

import (
	"financo/core/domain/types/currency"
	"time"
)

type SeriesEntry struct {
	Date   time.Time `json:"date"`
	Amount int64     `json:"amount"`
}

type Global struct {
	Currency currency.Type `json:"currency"`
	Amount   int64         `json:"amount"`
	Series   []SeriesEntry `json:"series"`
}

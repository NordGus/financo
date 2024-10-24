package responses

import (
	"financo/core/domain/records/account"
	"financo/lib/currency"
	"financo/lib/icon"
	"financo/lib/nullable"
	"time"
)

type History struct {
	Balance int64     `json:"balance"`
	At      time.Time `json:"at"`
}

type Detailed struct {
	ID          int64                    `json:"id"`
	Kind        account.Kind             `json:"kind"`
	Currency    currency.Type            `json:"currency"`
	Name        string                   `json:"name"`
	Description nullable.Type[string]    `json:"description"`
	Balance     int64                    `json:"balance"`
	Capital     int64                    `json:"capital"`
	History     nullable.Type[History]   `json:"history"`
	Color       string                   `json:"color"`
	Icon        icon.Type                `json:"icon"`
	ArchivedAt  nullable.Type[time.Time] `json:"archivedAt"`
	CreatedAt   time.Time                `json:"createdAt"`
	UpdatedAt   time.Time                `json:"updatedAt"`
	Children    []DetailedChild          `json:"children"`
}

type DetailedChild struct {
	ID          int64                    `json:"id"`
	Kind        account.Kind             `json:"kind"`
	Currency    currency.Type            `json:"currency"`
	Name        string                   `json:"name"`
	Description nullable.Type[string]    `json:"description"`
	Balance     int64                    `json:"balance"`
	Capital     int64                    `json:"capital"`
	History     nullable.Type[History]   `json:"history"`
	Color       string                   `json:"color"`
	Icon        icon.Type                `json:"icon"`
	ArchivedAt  nullable.Type[time.Time] `json:"archivedAt"`
	CreatedAt   time.Time                `json:"createdAt"`
	UpdatedAt   time.Time                `json:"updatedAt"`
}

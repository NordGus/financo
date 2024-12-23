package responses

import (
	"financo/lib/color"
	"financo/lib/currency"
	"financo/lib/icon"
	"financo/lib/nullable"
	"financo/models/account"
	"time"
)

type Listed struct {
	ID           int64                    `json:"id"`
	Kind         account.Kind             `json:"kind"`
	Currency     currency.Type            `json:"currency"`
	Name         string                   `json:"name"`
	Description  nullable.Type[string]    `json:"description"`
	Color        color.Type               `json:"color"`
	Icon         icon.Type                `json:"icon"`
	ArchivedAt   nullable.Type[time.Time] `json:"archivedAt"`
	DeletedAt    nullable.Type[time.Time] `json:"deletedAt"`
	CreatedAt    time.Time                `json:"createdAt"`
	UpdatedAt    time.Time                `json:"updatedAt"`
	Transactions int64                    `json:"transactions"`
	Children     []ListedChild            `json:"children"`
}

type ListedChild struct {
	ID           int64                    `json:"id"`
	Kind         account.Kind             `json:"kind"`
	Currency     currency.Type            `json:"currency"`
	Name         string                   `json:"name"`
	Description  nullable.Type[string]    `json:"description"`
	Color        color.Type               `json:"color"`
	Icon         icon.Type                `json:"icon"`
	ArchivedAt   nullable.Type[time.Time] `json:"archivedAt"`
	DeletedAt    nullable.Type[time.Time] `json:"deletedAt"`
	CreatedAt    time.Time                `json:"createdAt"`
	UpdatedAt    time.Time                `json:"updatedAt"`
	Transactions int64                    `json:"transactions"`
}

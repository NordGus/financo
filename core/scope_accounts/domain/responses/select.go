package responses

import (
	"financo/core/domain/records/account"
	"financo/server/types/generic/nullable"
	"financo/server/types/shared/color"
	"financo/server/types/shared/currency"
	"financo/server/types/shared/icon"
	"time"
)

type Select struct {
	ID          int64                    `json:"id"`
	Kind        account.Kind             `json:"kind"`
	Currency    currency.Type            `json:"currency"`
	Name        string                   `json:"name"`
	Description nullable.Type[string]    `json:"description"`
	Color       color.Type               `json:"color"`
	Icon        icon.Type                `json:"icon"`
	ArchivedAt  nullable.Type[time.Time] `json:"archivedAt"`
	CreatedAt   time.Time                `json:"createdAt"`
	UpdatedAt   time.Time                `json:"updatedAt"`
	Children    []SelectChild            `json:"children"`
}

type SelectChild struct {
	ID          int64                    `json:"id"`
	Kind        account.Kind             `json:"kind"`
	Currency    currency.Type            `json:"currency"`
	Name        string                   `json:"name"`
	Description nullable.Type[string]    `json:"description"`
	Color       color.Type               `json:"color"`
	Icon        icon.Type                `json:"icon"`
	ArchivedAt  nullable.Type[time.Time] `json:"archivedAt"`
	CreatedAt   time.Time                `json:"createdAt"`
	UpdatedAt   time.Time                `json:"updatedAt"`
}

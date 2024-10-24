package responses

import (
	"financo/core/domain/records/account"
	"financo/core/domain/types/color"
	"financo/core/domain/types/currency"
	"financo/core/domain/types/icon"
	"financo/server/types/generic/nullable"
	"time"
)

type Preview struct {
	ID          int64                    `json:"id"`
	Kind        account.Kind             `json:"kind"`
	Currency    currency.Type            `json:"currency"`
	Name        string                   `json:"name"`
	Description nullable.Type[string]    `json:"description"`
	Balance     int64                    `json:"balance"`
	Capital     int64                    `json:"capital"`
	Color       color.Type               `json:"color"`
	Icon        icon.Type                `json:"icon"`
	ArchivedAt  nullable.Type[time.Time] `json:"archivedAt"`
	CreatedAt   time.Time                `json:"createdAt"`
	UpdatedAt   time.Time                `json:"updatedAt"`
	Children    []PreviewChild           `json:"children"`
}

type PreviewChild struct {
	ID          int64                    `json:"id"`
	Kind        account.Kind             `json:"kind"`
	Currency    currency.Type            `json:"currency"`
	Name        string                   `json:"name"`
	Description nullable.Type[string]    `json:"description"`
	Balance     int64                    `json:"balance"`
	Capital     int64                    `json:"capital"`
	Color       color.Type               `json:"color"`
	Icon        icon.Type                `json:"icon"`
	ArchivedAt  nullable.Type[time.Time] `json:"archivedAt"`
	CreatedAt   time.Time                `json:"createdAt"`
	UpdatedAt   time.Time                `json:"updatedAt"`
}

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
	ID             int64                    `json:"id,omitempty"`
	ParentID       nullable.Type[int64]     `json:"parentId,omitempty"`
	Kind           account.Kind             `json:"kind,omitempty"`
	Currency       currency.Type            `json:"currency,omitempty"`
	Name           string                   `json:"name,omitempty"`
	Description    nullable.Type[string]    `json:"description,omitempty"`
	Color          color.Type               `json:"color,omitempty"`
	Icon           icon.Type                `json:"icon,omitempty"`
	Capital        int64                    `json:"capital,omitempty"`
	ArchivedAt     nullable.Type[time.Time] `json:"archivedAt,omitempty"`
	DeletedAt      nullable.Type[time.Time] `json:"deletedAt,omitempty"`
	CreatedAt      time.Time                `json:"createdAt,omitempty"`
	UpdatedAt      time.Time                `json:"updatedAt,omitempty"`
	AdditionalData AdditionalData           `json:"additionalData,omitempty"`
}

type AdditionalData struct {
	Main         bool        `json:"main,omitempty"`
	History      HistoryData `json:"history,omitempty"`
	Transactions int64       `json:"transactions,omitempty"`
}

type HistoryData struct {
	At      nullable.Type[time.Time] `json:"at,omitempty"`
	Balance nullable.Type[int64]     `json:"balance,omitempty"`
}

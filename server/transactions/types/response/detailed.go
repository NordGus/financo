package response

import (
	"financo/server/types/generic/nullable"
	"financo/server/types/records/account"
	"financo/server/types/shared/color"
	"financo/server/types/shared/currency"
	"financo/server/types/shared/icon"
	"time"
)

type Detailed struct {
	ID           int64                    `json:"id"`
	IssuedAt     time.Time                `json:"issuedAt"`
	ExecutedAt   nullable.Type[time.Time] `json:"executedAt"`
	Source       Account                  `json:"source"`
	SourceAmount int64                    `json:"sourceAmount"`
	Target       Account                  `json:"target"`
	TargetAmount int64                    `json:"targetAmount"`
	Notes        nullable.Type[string]    `json:"notes"`
	CreatedAt    time.Time                `json:"createdAt"`
	UpdatedAt    time.Time                `json:"updatedAt"`
}

type Account struct {
	ID         int64                        `json:"id"`
	Kind       account.Kind                 `json:"kind"`
	Currency   currency.Type                `json:"currency"`
	Name       string                       `json:"name"`
	Color      color.Type                   `json:"color"`
	Icon       icon.Type                    `json:"icon"`
	ArchivedAt nullable.Type[time.Time]     `json:"archivedAt"`
	CreatedAt  time.Time                    `json:"createdAt"`
	UpdatedAt  time.Time                    `json:"updatedAt"`
	Parent     nullable.Type[AccountParent] `json:"parent"`
}

type AccountParent struct {
	ID         int64                    `json:"id"`
	Kind       account.Kind             `json:"kind"`
	Currency   currency.Type            `json:"currency"`
	Name       string                   `json:"name"`
	Color      color.Type               `json:"color"`
	Icon       icon.Type                `json:"icon"`
	ArchivedAt nullable.Type[time.Time] `json:"archivedAt"`
	CreatedAt  time.Time                `json:"createdAt"`
	UpdatedAt  time.Time                `json:"updatedAt"`
}
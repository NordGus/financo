package request

import (
	"financo/server/types/generic/nullable"
	"financo/server/types/records/account"
	"financo/server/types/shared/color"
	"financo/server/types/shared/currency"
	"financo/server/types/shared/icon"
	"time"
)

type UpdateHistory struct {
	Present bool                     `json:"present"`
	Balance nullable.Type[int64]     `json:"balance"`
	At      nullable.Type[time.Time] `json:"at"`
}

type UpdateChild struct {
	ID          nullable.Type[int64]  `json:"id"`
	Kind        account.Kind          `json:"kind"`
	Currency    currency.Type         `json:"currency"`
	Name        string                `json:"name"`
	Description nullable.Type[string] `json:"description"`
	Capital     int64                 `json:"capital"`
	History     UpdateHistory         `json:"history"`
	Color       color.Type            `json:"color"`
	Icon        icon.Type             `json:"icon"`
	Archive     bool                  `json:"archive"`
	Delete      bool                  `json:"delete"`
}

type Update struct {
	ID          int64                 `json:"id"`
	Kind        account.Kind          `json:"kind"`
	Currency    currency.Type         `json:"currency"`
	Name        string                `json:"name"`
	Description nullable.Type[string] `json:"description"`
	Capital     int64                 `json:"capital"`
	History     UpdateHistory         `json:"history"`
	Color       color.Type            `json:"color"`
	Icon        icon.Type             `json:"icon"`
	Archive     bool                  `json:"archive"`
	Children    []UpdateChild         `json:"children"`
}

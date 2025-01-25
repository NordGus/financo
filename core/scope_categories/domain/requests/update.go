package requests

import (
	"financo/lib/color"
	"financo/lib/currency"
	"financo/lib/icon"
	"financo/lib/nullable"
	"financo/models/account"
	"time"
)

type Update struct {
	ID          int64                 `json:"id"`
	Name        string                `json:"name"`
	Description nullable.Type[string] `json:"description"`
	Currency    currency.Type         `json:"currency"`
	Color       color.Type            `json:"color"`
	Icon        icon.Type             `json:"icon"`
}

func (req *Update) ToRecord(r account.Record, timestamp time.Time) account.Record {
	r.Currency = req.Currency
	r.Name = req.Name
	r.Description = req.Description
	r.Color = req.Color
	r.Icon = req.Icon
	r.UpdatedAt = timestamp

	return r
}

type UpdateChild struct {
	ID          int64                 `json:"id"`
	ParentID    int64                 `json:"parentId"`
	Name        string                `json:"name"`
	Description nullable.Type[string] `json:"description"`
	Icon        icon.Type             `json:"icon"`
}

func (req *UpdateChild) ToRecords(child account.Record, timestamp time.Time) account.Record {
	child.Name = req.Name
	child.Description = req.Description
	child.Icon = req.Icon
	child.UpdatedAt = timestamp

	return child
}

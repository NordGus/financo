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
	ID            int64                 `json:"id"`
	Name          string                `json:"name"`
	Description   nullable.Type[string] `json:"description"`
	Color         color.Type            `json:"color"`
	Icon          icon.Type             `json:"icon"`
	Subcategories []UpdateSubcategory   `json:"subcategories"`
}

func (req *Update) ToRecord(r account.Record, timestamp time.Time) account.Record {
	r.Currency = currency.MULTI
	r.Name = req.Name
	r.Description = req.Description
	r.Color = req.Color
	r.Icon = req.Icon
	r.UpdatedAt = timestamp

	return r
}

// UpdateChild is here for seeds stuff
type UpdateChild struct {
	ID          int64                 `json:"id"`
	ParentID    int64                 `json:"parentId"`
	Name        string                `json:"name"`
	Description nullable.Type[string] `json:"description"`
	Icon        icon.Type             `json:"icon"`
}

func (req *UpdateChild) ToRecord(child account.Record, timestamp time.Time) account.Record {
	child.Currency = currency.MULTI
	child.Name = req.Name
	child.Description = req.Description
	child.Icon = req.Icon
	child.UpdatedAt = timestamp

	return child
}

type UpdateSubcategory struct {
	ID          nullable.Type[int64]  `json:"id"`
	Name        string                `json:"name"`
	Description nullable.Type[string] `json:"description"`
	Icon        icon.Type             `json:"icon"`
	Intent      Intent                `json:"intent"`
}

func (req *UpdateSubcategory) ToRecord(c account.Record, p account.Record, timestamp time.Time) account.Record {
	c.Kind = p.Kind
	c.Color = p.Color
	c.Currency = currency.MULTI
	c.ParentID = nullable.New(p.ID)
	c.Name = req.Name
	c.Description = req.Description
	c.Icon = req.Icon
	c.UpdatedAt = timestamp

	if req.Intent == CREATE {
		c.CreatedAt = timestamp
		c.DeletedAt = nullable.Type[time.Time]{}
		c.ArchivedAt = nullable.Type[time.Time]{}
	}

	if req.Intent == DESTROY {
		c.DeletedAt = nullable.New(timestamp)
	}

	if req.Intent == ARCHIVE {
		c.ArchivedAt = nullable.New(timestamp)
	}

	if req.Intent == UNARCHIVE {
		c.ArchivedAt = nullable.Type[time.Time]{}
	}

	return c
}

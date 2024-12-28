package requests

import (
	"financo/lib/color"
	"financo/lib/currency"
	"financo/lib/icon"
	"financo/lib/nullable"
	"financo/models/account"
	"time"
)

type UpdateChild struct {
	ID          int64                 `json:"id"`
	Name        string                `json:"name"`
	Description nullable.Type[string] `json:"description"`
	Icon        icon.Type             `json:"icon"`
}

type Update struct {
	ID          int64                 `json:"id"`
	Name        string                `json:"name"`
	Description nullable.Type[string] `json:"description"`
	Currency    currency.Type         `json:"currency"`
	Color       color.Type            `json:"color"`
	Icon        icon.Type             `json:"icon"`
	Children    []UpdateChild         `json:"children"`
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

func (req *Update) ToChildrenRecords(r []account.Record, p account.Record, timestamp time.Time) []account.Record {
	out := make([]account.Record, 0, 10)

	for i := 0; i < len(req.Children); i++ {
		found := false

		for j := 0; j < len(r); j++ {
			if r[j].ID != req.Children[i].ID {
				continue
			}

			r[j].Name = req.Children[i].Name
			r[j].Description = req.Children[i].Description
			r[j].Icon = req.Children[i].Icon
			r[j].UpdatedAt = timestamp

			found = true
			out = append(out, r[j])

			break
		}

		if found {
			continue
		}

		out = append(out, account.Record{
			ID:          -1,
			ParentID:    nullable.New(p.ID),
			Kind:        p.Kind,
			Currency:    req.Currency,
			Name:        req.Children[i].Name,
			Description: req.Children[i].Description,
			Color:       req.Color,
			Icon:        req.Children[i].Icon,
			Capital:     0,
			CreatedAt:   timestamp,
			UpdatedAt:   timestamp,
			DynamicData: account.DynamicData{},
		})
	}

	return out
}

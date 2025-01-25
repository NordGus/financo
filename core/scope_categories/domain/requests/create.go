package requests

import (
	"financo/lib/color"
	"financo/lib/currency"
	"financo/lib/icon"
	"financo/lib/nullable"
	"financo/models/account"
	"time"
)

type CreateChild struct {
	Name        string                `json:"name"`
	Description nullable.Type[string] `json:"description"`
	Icon        icon.Type             `json:"icon"`
}

type Create struct {
	Kind        account.Kind          `json:"kind"`
	Name        string                `json:"name"`
	Description nullable.Type[string] `json:"description"`
	Currency    currency.Type         `json:"currency"`
	Color       color.Type            `json:"color"`
	Icon        icon.Type             `json:"icon"`
	Children    []CreateChild         `json:"children"`
}

func (req *Create) ToRecord(timestamp time.Time) account.Record {
	return account.Record{
		ID:          -1,
		Kind:        req.Kind,
		Currency:    req.Currency,
		Name:        req.Name,
		Description: req.Description,
		Color:       req.Color,
		Icon:        req.Icon,
		Capital:     0,
		CreatedAt:   timestamp,
		UpdatedAt:   timestamp,
		DynamicData: account.DynamicData{},
	}
}

func (req *Create) ToChildrenRecords(timestamp time.Time) []account.Record {
	out := make([]account.Record, 0, 10)

	for i := 0; i < len(req.Children); i++ {
		out = append(out, account.Record{
			ID:          -1,
			Kind:        req.Kind,
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

type CreateChildForParent struct {
	ParentID    int64                 `json:"parentId"`
	Name        string                `json:"name"`
	Description nullable.Type[string] `json:"description"`
	Icon        icon.Type             `json:"icon"`
}

func (req *CreateChildForParent) ToRecord(parent account.Record, timestamp time.Time) account.Record {
	return account.Record{
		ID:          -1,
		Kind:        parent.Kind,
		Currency:    parent.Currency,
		Name:        req.Name,
		Description: req.Description,
		Color:       parent.Color,
		Icon:        req.Icon,
		Capital:     0,
		CreatedAt:   timestamp,
		UpdatedAt:   timestamp,
		DynamicData: account.DynamicData{},
	}
}

package responses

import (
	"financo/core/scope_categories/domain/models/category"
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

func NewListedFromCategoryRecord(r category.Record) Listed {
	out := Listed{
		ID:           r.Parent.ID,
		Kind:         r.Parent.Kind,
		Currency:     r.Parent.Currency,
		Name:         r.Parent.Name,
		Description:  r.Parent.Description,
		Color:        r.Parent.Color,
		Icon:         r.Parent.Icon,
		ArchivedAt:   r.Parent.ArchivedAt,
		DeletedAt:    r.Parent.DeletedAt,
		CreatedAt:    r.Parent.CreatedAt,
		UpdatedAt:    r.Parent.UpdatedAt,
		Transactions: r.Parent.DynamicData.Transactions,
		Children:     make([]ListedChild, 0, len(r.Children)),
	}

	for i := 0; i < len(r.Children); i++ {
		out.Children = append(out.Children, ListedChild{
			ID:           r.Children[i].ID,
			Kind:         r.Children[i].Kind,
			Currency:     r.Children[i].Currency,
			Name:         r.Children[i].Name,
			Description:  r.Children[i].Description,
			Color:        r.Children[i].Color,
			Icon:         r.Children[i].Icon,
			ArchivedAt:   r.Children[i].ArchivedAt,
			DeletedAt:    r.Children[i].DeletedAt,
			CreatedAt:    r.Children[i].CreatedAt,
			UpdatedAt:    r.Children[i].UpdatedAt,
			Transactions: r.Children[i].DynamicData.Transactions,
		})
	}

	return out
}

func NewListedChildFromAccountRecord(child account.Record) ListedChild {
	return ListedChild{
		ID:           child.ID,
		Kind:         child.Kind,
		Currency:     child.Currency,
		Name:         child.Name,
		Description:  child.Description,
		Color:        child.Color,
		Icon:         child.Icon,
		ArchivedAt:   child.ArchivedAt,
		DeletedAt:    child.DeletedAt,
		CreatedAt:    child.CreatedAt,
		UpdatedAt:    child.UpdatedAt,
		Transactions: child.DynamicData.Transactions,
	}
}

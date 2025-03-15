package responses

import (
	"financo/lib/color"
	"financo/lib/currency"
	"financo/lib/icon"
	"financo/lib/nullable"
	"financo/models/account"
	"time"
)

type Account struct {
	ID          int64                    `json:"id"`
	ParentID    nullable.Type[int64]     `json:"parentId"`
	Kind        account.Kind             `json:"kind"`
	Currency    currency.Type            `json:"currency"`
	Name        string                   `json:"name"`
	Description nullable.Type[string]    `json:"description"`
	Color       color.Type               `json:"color"`
	Icon        icon.Type                `json:"icon"`
	Capital     int64                    `json:"capital"`
	Balance     int64                    `json:"balance"`
	Main        bool                     `json:"main"`
	ArchivedAt  nullable.Type[time.Time] `json:"archivedAt"`
	DeletedAt   nullable.Type[time.Time] `json:"deletedAt"`
	CreatedAt   time.Time                `json:"createdAt"`
	UpdatedAt   time.Time                `json:"updatedAt"`
}

func RecordToAccount(r account.Record) Account {
	return Account{
		ID:          r.ID,
		ParentID:    r.ParentID,
		Kind:        r.Kind,
		Currency:    r.Currency,
		Name:        r.Name,
		Description: r.Description,
		Color:       r.Color,
		Icon:        r.Icon,
		Capital:     r.Capital,
		Balance:     r.DynamicData.Balance,
		Main:        r.DynamicData.Main,
		ArchivedAt:  r.ArchivedAt,
		DeletedAt:   r.DeletedAt,
		CreatedAt:   r.CreatedAt,
		UpdatedAt:   r.UpdatedAt,
	}
}

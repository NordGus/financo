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
	ID             int64                    `json:"id"`
	Kind           account.Kind             `json:"kind"`
	Currency       currency.Type            `json:"currency"`
	Name           string                   `json:"name"`
	Description    nullable.Type[string]    `json:"description"`
	Color          color.Type               `json:"color"`
	Icon           icon.Type                `json:"icon"`
	Capital        int64                    `json:"capital"`
	ArchivedAt     nullable.Type[time.Time] `json:"archivedAt"`
	DeletedAt      nullable.Type[time.Time] `json:"deletedAt"`
	CreatedAt      time.Time                `json:"createdAt"`
	UpdatedAt      time.Time                `json:"updatedAt"`
	AdditionalData AdditionalData           `json:"additionalData"`
}

type AdditionalData struct {
	Main         bool        `json:"main"`
	Balance      int64       `json:"balance"`
	History      HistoryData `json:"history"`
	Transactions int64       `json:"transactions"`
}

type HistoryData struct {
	At      nullable.Type[time.Time] `json:"at"`
	Balance nullable.Type[int64]     `json:"balance"`
}

func AccountRecordToListed(a account.Record) Listed {
	return Listed{
		ID:          a.ID,
		Kind:        a.Kind,
		Currency:    a.Currency,
		Name:        a.Name,
		Description: a.Description,
		Color:       a.Color,
		Icon:        a.Icon,
		Capital:     a.Capital,
		ArchivedAt:  a.ArchivedAt,
		DeletedAt:   a.DeletedAt,
		CreatedAt:   a.CreatedAt,
		UpdatedAt:   a.UpdatedAt,
		AdditionalData: AdditionalData{
			Main:    a.DynamicData.Main,
			Balance: a.DynamicData.Balance,
			History: HistoryData{
				At:      a.DynamicData.History.At,
				Balance: a.DynamicData.History.Balance,
			},
			Transactions: a.DynamicData.Transactions,
		},
	}
}

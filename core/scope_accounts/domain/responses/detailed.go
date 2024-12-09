package responses

import (
	"financo/lib/color"
	"financo/lib/currency"
	"financo/lib/icon"
	"financo/lib/nullable"
	"financo/models/account"
	"time"
)

type Detailed struct {
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
	Children       []Detailed               `json:"children"`
}

func (res Detailed) FromRecord(r account.Record, c []account.Record) Detailed {
	out := detailedFromRecord(r)
	out.Children = res.Children

	for i := 0; i < len(c); i++ {
		out.Children = append(out.Children, detailedFromRecord(c[i]))
	}

	return out
}

func detailedFromRecord(r account.Record) Detailed {
	var res Detailed

	res.ID = r.ID
	res.Kind = r.Kind
	res.Currency = r.Currency
	res.Name = r.Name
	res.Description = r.Description
	res.Color = r.Color
	res.Icon = r.Icon
	res.Capital = r.Capital
	res.ArchivedAt = r.ArchivedAt
	res.DeletedAt = r.DeletedAt
	res.CreatedAt = r.CreatedAt
	res.UpdatedAt = r.UpdatedAt
	res.AdditionalData.Main = r.DynamicData.Main
	res.AdditionalData.Balance = r.DynamicData.Balance
	res.AdditionalData.Transactions = r.DynamicData.Transactions
	res.AdditionalData.History.At = r.DynamicData.History.At
	res.AdditionalData.History.Balance = r.DynamicData.History.Balance

	return res
}

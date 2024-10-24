package requests

import (
	"financo/core/domain/records/account"
	"financo/server/types/generic/nullable"
	"financo/server/types/shared/color"
	"financo/server/types/shared/currency"
	"financo/server/types/shared/icon"
	"time"
)

type Create struct {
	Kind        account.Kind          `json:"kind"`
	Currency    currency.Type         `json:"currency"`
	Name        string                `json:"name"`
	Description nullable.Type[string] `json:"description"`
	Capital     int64                 `json:"capital"`
	Color       color.Type            `json:"color"`
	Icon        icon.Type             `json:"icon"`
}

func CreateToAccountRecord(req Create, timestamp time.Time) account.Record {
	record := account.Record{
		ID:          -1,
		Kind:        req.Kind,
		Currency:    req.Currency,
		Name:        req.Name,
		Description: req.Description,
		Color:       req.Color,
		Icon:        req.Icon,
		Capital:     0,
		UpdatedAt:   timestamp,
		CreatedAt:   timestamp,
	}

	if account.IsDebt(req.Kind) {
		record.Capital = req.Capital
	}

	return record
}

func CreateToSystemHistoricAccountRecord(req Create, timestamp time.Time) nullable.Type[account.Record] {
	if account.IsExternal(req.Kind) {
		return nullable.Type[account.Record]{}
	}

	return nullable.New(account.Record{
		ID:          -1,
		Kind:        account.SystemHistoric,
		Currency:    req.Currency,
		Name:        "History",
		Description: nullable.New("This account was created by the system to represent the lost balance history of the parent account. DO NOT MODIFY NOR DELETE"),
		Color:       "#8c8c8c",
		Icon:        icon.Base,
		Capital:     0,
		UpdatedAt:   timestamp,
		CreatedAt:   timestamp,
	})
}

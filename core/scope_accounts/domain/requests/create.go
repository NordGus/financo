package requests

import (
	"financo/lib/color"
	"financo/lib/currency"
	"financo/lib/icon"
	"financo/lib/nullable"
	"financo/models/account"
	"time"
)

type History struct {
	At      nullable.Type[time.Time] `json:"at"`
	Balance nullable.Type[int64]     `json:"balance"`
}

type Create struct {
	Kind        account.Kind          `json:"kind"`
	Currency    currency.Type         `json:"currency"`
	Name        string                `json:"name"`
	Description nullable.Type[string] `json:"description"`
	Capital     int64                 `json:"capital"`
	Color       color.Type            `json:"color"`
	Icon        icon.Type             `json:"icon"`
	History     History               `json:"history"`
	Main        bool                  `json:"main"`
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
		DynamicData: account.DynamicData{
			Main:    req.Main,
			Balance: req.History.Balance.OrElse(0),
			History: account.HistoryDynamicData{
				At:      req.History.At,
				Balance: req.History.Balance,
			},
		},
	}

	if account.IsDebt(req.Kind) {
		record.Capital = req.Capital
	}

	if record.DynamicData.History.At.Valid && !account.IsExternal(record.Kind) {
		record.DynamicData.Transactions = 1
	}

	return record
}

func CreateToSystemHistoricAccountRecord(req Create, timestamp time.Time) nullable.Type[account.Record] {
	if account.IsExternal(req.Kind) {
		return nullable.Type[account.Record]{}
	}

	record := account.Record{
		ID:          -1,
		Kind:        account.SystemHistoric,
		Currency:    req.Currency,
		Name:        "History",
		Description: nullable.New("This Account was created by the system to represent the starting point for the incomplete ledger for its parent Account. DO NOT MODIFY NOR DELETE"),
		Color:       color.HistoryAccountColor,
		Icon:        icon.Bookmark,
		Capital:     0,
		UpdatedAt:   timestamp,
		CreatedAt:   timestamp,
		DynamicData: account.DynamicData{
			Balance: req.History.Balance.OrElse(0) * -1,
		},
	}

	if req.History.At.Valid && !account.IsExternal(req.Kind) {
		record.DynamicData.Transactions = 1
	}

	return nullable.New(record)
}

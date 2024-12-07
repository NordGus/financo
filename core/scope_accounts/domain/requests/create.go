package requests

import (
	"financo/lib/color"
	"financo/lib/currency"
	"financo/lib/icon"
	"financo/lib/nullable"
	"financo/models/account"
	"financo/models/transaction"
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

func (req *Create) Record(timestamp time.Time) account.Record {
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

	if record.DynamicData.History.At.Valid {
		record.DynamicData.Transactions = 1
		record.DynamicData.History.At.Val = record.DynamicData.History.At.Val.UTC()
	}

	return record
}

func (req *Create) HistoryRecord(timestamp time.Time) account.Record {
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

	if req.History.At.Valid {
		record.DynamicData.Transactions = 1
	}

	return record
}

func (req *Create) HistoryTransaction(timestamp time.Time) nullable.Type[transaction.Record] {
	if !req.History.At.Valid {
		return nullable.Type[transaction.Record]{}
	}

	record := transaction.Record{
		ID:           -1,
		SourceID:     -1,
		TargetID:     -1,
		SourceAmount: req.History.Balance.OrElse(0),
		TargetAmount: req.History.Balance.OrElse(0),
		Notes:        nullable.New("This Transaction was created by the system to represent the starting point for the incomplete ledger for the Account. DO NOT MODIFY NOR DELETE"),
		IssuedAt:     req.History.At.Val,
		ExecutedAt:   req.History.At,
		UpdatedAt:    timestamp,
		CreatedAt:    timestamp,
	}

	return nullable.New(record)
}

func (req *Create) Interest(timestamp time.Time) nullable.Type[account.Record] {
	if account.IsCapital(req.Kind) || account.IsPersonalDebt(req.Kind) {
		return nullable.Type[account.Record]{}
	}

	record := account.Record{
		ID:          -1,
		Currency:    req.Currency,
		Name:        "Interest",
		Description: nullable.New("This Account was created by the system to function as the source or target its parent Account interest. DO NOT MODIFY NOR DELETE"),
		Icon:        icon.Landmark,
		Capital:     0,
		UpdatedAt:   timestamp,
		CreatedAt:   timestamp,
	}

	if account.IsSavings(req.Kind) {
		record.Kind = account.ExternalIncome
		record.Color = color.IncomeInterestColor
	}

	if account.IsCredit(req.Kind) || account.IsLoan(req.Kind) {
		record.Kind = account.ExternalExpense
		record.Color = color.ExpenseInterestColor
	}

	return nullable.New(record)
}

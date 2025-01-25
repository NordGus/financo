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

// History is the DTO that handles the processes related to accounts with an
// incomplete ledger history inside financo.
type History struct {
	At      nullable.Type[time.Time] `json:"at"`
	Balance nullable.Type[int64]     `json:"balance"`
}

// Create is the DTO for requests that want to create a new account inside
// financo
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

// Record maps [Create] into a [account.Record] use by financo
func (req *Create) Record(timestamp time.Time) account.Record {
	// Builds the basic record data
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
			Balance: req.History.Balance.OrElse(0),
			History: account.HistoryDynamicData{
				At:      req.History.At,
				Balance: req.History.Balance,
			},
		},
	}

	// Sets the capital to the one send by the request only if the account been
	// created is [account.DebtLoan], [account.DebtPersonal] or
	// [account.DebtCredit]
	if account.IsDebt(req.Kind) {
		record.Capital = req.Capital
	}

	// Sets the DynamicData Main attribute to the one set by the request only if
	// the account been created is [account.CapitalNormal]
	if account.IsCapital(record.Kind) {
		record.DynamicData.Main = req.Main
	}

	// Sets the DynamicData History attributes to the one set by the request only
	// if the request History attributes contains a At date.
	//
	// When the request contains a valid At attribute it means that the account
	// been created has an incomplete ledger.
	if req.History.At.Valid {
		record.DynamicData.Transactions = 1
		record.DynamicData.History.At.Val = req.History.At.Val.UTC()
	} else {
		record.DynamicData.History.Balance = nullable.Type[int64]{}
	}

	return record
}

// HistoryRecord maps [Create] into a [account.Record] that represents the
// account previous ledger history.
func (req *Create) HistoryRecord(timestamp time.Time) account.Record {
	// Builds the basic record data
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

	// Sets the DynamicData Transaction attribute to reflect that the account has
	// an incomplete ledger and starts with a single account.
	//
	// When the request contains a valid At attribute it means that the account
	// been created has an incomplete ledger.
	if req.History.At.Valid {
		record.DynamicData.Transactions = 1
	}

	return record
}

// HistoryTransaction maps [Create] into a [transaction.Record] that represents
// movement of currency between the account been created and its history
// account.
func (req *Create) HistoryTransaction(timestamp time.Time) transaction.Record {
	// Builds the basic record data
	record := transaction.Record{
		ID:           -1,
		SourceID:     -1,
		TargetID:     -1,
		SourceAmount: req.History.Balance.OrElse(0),
		TargetAmount: req.History.Balance.OrElse(0),
		Notes:        nullable.New("This Transaction was created by the system to represent the starting point for the incomplete ledger for the Account. DO NOT MODIFY NOR DELETE"),
		IssuedAt:     req.History.At.OrElse(timestamp).UTC(),
		ExecutedAt:   req.History.At,
		UpdatedAt:    timestamp,
		CreatedAt:    timestamp,
	}

	// Sets the ExecutedAt value for the transaction if the request History At
	// attribute contains a valid value.
	if req.History.At.Valid {
		record.ExecutedAt.Val = record.ExecutedAt.Val.UTC()
	}

	// Sets the DeletedAt value for the transaction if the request History At
	// attribute doesn't contain a valid value. This means that the account has a
	// complete ledger history so the transaction is created as deleted, but is
	// is created for the case the user changes this later.
	if !req.History.At.Valid {
		record.DeletedAt = nullable.New(timestamp)
	}

	return record
}

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

// UpdateHistory is the DTO that handles the processes related to accounts with
// an incomplete ledger history inside financo.
type UpdateHistory struct {
	At      nullable.Type[time.Time] `json:"at"`
	Balance nullable.Type[int64]     `json:"balance"`
}

// Update is the DTO for requests that want to update an existing account inside
// financo
type Update struct {
	ID          int64                 `json:"id"`
	Currency    currency.Type         `json:"currency"`
	Name        string                `json:"name"`
	Description nullable.Type[string] `json:"description"`
	Capital     int64                 `json:"capital"`
	Color       color.Type            `json:"color"`
	Icon        icon.Type             `json:"icon"`
	History     History               `json:"history"`
	Main        bool                  `json:"main"`
}

// Record maps [Update] into the given [account.Record] use by financo to update
// it.
func (req *Update) Record(r account.Record, timestamp time.Time) account.Record {
	// Builds the basic record data
	r.Currency = req.Currency
	r.Name = req.Name
	r.Description = req.Description
	r.Color = req.Color
	r.Icon = req.Icon
	r.UpdatedAt = timestamp

	// Sets the capital to the one send by the request only if the account been
	// updated is [account.Debt] or [account.Credit]
	if account.IsPassive(r.Kind) {
		r.Capital = req.Capital
	}

	// Sets the DynamicData Main attribute to the one set by the request only if
	// the account been updated is [account.Capital]
	if account.IsCapital(r.Kind) {
		r.DynamicData.Main = req.Main
	}

	// Sets the DynamicData History attributes to the one set by the request only
	// if the request History attributes contains a At date.
	//
	// When the request contains a valid At attribute it means that the account
	// been created has an incomplete ledger.
	if req.History.At.Valid {
		r.DynamicData.History.At.Val = req.History.At.Val.UTC()
		r.DynamicData.History.Balance = nullable.New(req.History.Balance.OrElse(0))
	} else {
		r.DynamicData.History.At = nullable.Type[time.Time]{}
		r.DynamicData.History.Balance = nullable.Type[int64]{}
	}

	return r
}

// Record maps [Update] into the given [account.Record] with [account.Kind] set
// to [account.History] use by financo to update it.
func (req *Update) HistoryRecord(r account.Record, timestamp time.Time) account.Record {
	// Builds the basic record data
	r.Currency = req.Currency
	r.UpdatedAt = timestamp

	// Sets the DynamicData attributes to the one set by the request only
	// if the request History attributes contains a At date.
	//
	// When the request contains a valid At attribute it means that the account
	// been created has an incomplete ledger.
	if req.History.At.Valid {
		r.DynamicData.Transactions = 1
		r.DynamicData.Balance = req.History.Balance.OrElse(0) * -1
	} else {
		r.DynamicData.Transactions = 0
		r.DynamicData.Balance = 0
	}

	return r
}

// HistoryTransaction maps [Update] into the given [transaction.Record] to
// update it
func (req *Update) HistoryTransaction(t transaction.Record, timestamp time.Time) transaction.Record {
	// Sets the transaction as deleted in the case the request doesn't contains a
	// a valid History At attribute.
	//
	// This means the the account no longer has an incomplete ledger.
	if !req.History.At.Valid {
		t.DeletedAt = nullable.New(t.DeletedAt.OrElse(timestamp))

		return t
	}

	t.SourceAmount = req.History.Balance.OrElse(0)
	t.TargetAmount = req.History.Balance.OrElse(0)
	t.Currency = req.Currency
	t.IssuedAt = req.History.At.Val.UTC()
	t.ExecutedAt = req.History.At
	t.UpdatedAt = timestamp

	// Set DeletedAt to null to reactivated
	t.DeletedAt = nullable.Type[time.Time]{}

	// Change the date into UTC
	t.ExecutedAt.Val = t.ExecutedAt.Val.UTC()

	t.Metadata.Kind = transaction.Transfer

	return t
}

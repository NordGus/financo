package requests

import (
	"financo/core/scope_accounts/domain/repositories"
	"financo/server/types/generic/nullable"
	"financo/server/types/records/account"
	"financo/server/types/records/transaction"
	"financo/server/types/shared/color"
	"financo/server/types/shared/currency"
	"financo/server/types/shared/icon"
	"time"
)

type UpdateHistory struct {
	Present bool                     `json:"present"`
	Balance nullable.Type[int64]     `json:"balance"`
	At      nullable.Type[time.Time] `json:"at"`
}

type UpdateChild struct {
	ID          nullable.Type[int64]  `json:"id"`
	Kind        account.Kind          `json:"kind"`
	Currency    currency.Type         `json:"currency"`
	Name        string                `json:"name"`
	Description nullable.Type[string] `json:"description"`
	Capital     int64                 `json:"capital"`
	History     UpdateHistory         `json:"history"`
	Color       color.Type            `json:"color"`
	Icon        icon.Type             `json:"icon"`
	Archive     bool                  `json:"archive"`
	Delete      bool                  `json:"delete"`
}

type Update struct {
	ID          int64                 `json:"id"`
	Kind        account.Kind          `json:"kind"`
	Currency    currency.Type         `json:"currency"`
	Name        string                `json:"name"`
	Description nullable.Type[string] `json:"description"`
	Capital     int64                 `json:"capital"`
	History     UpdateHistory         `json:"history"`
	Color       color.Type            `json:"color"`
	Icon        icon.Type             `json:"icon"`
	Archive     bool                  `json:"archive"`
	Children    []UpdateChild         `json:"children"`
}

func UpdateToAccountRecord(req Update, timestamp time.Time) account.Record {
	record := account.Record{
		ID:          req.ID,
		Kind:        req.Kind,
		Currency:    req.Currency,
		Name:        req.Name,
		Description: req.Description,
		Capital:     req.Capital,
		Color:       req.Color,
		Icon:        req.Icon,
		UpdatedAt:   timestamp,
	}

	if req.Archive {
		record.ArchivedAt = nullable.New(timestamp)
	}

	return record
}

func UpdateChildToAccountRecord(parent account.Record, req UpdateChild, timestamp time.Time) account.Record {
	record := account.Record{
		ID:          req.ID.OrElse(-1),
		ParentID:    nullable.New(parent.ID),
		Kind:        parent.Kind,
		Currency:    parent.Currency,
		Name:        req.Name,
		Description: req.Description,
		Capital:     req.Capital,
		Color:       parent.Color,
		Icon:        req.Icon,
		UpdatedAt:   timestamp,
	}

	if record.ID <= 0 {
		record.CreatedAt = timestamp
	}

	if req.Archive {
		record.ArchivedAt = nullable.New(timestamp)
	}

	return record
}

func UpdateHistoryToTransactionRecord(
	req UpdateHistory,
	records repositories.AccountWithHistory,
	timestamp time.Time,
) nullable.Type[transaction.Record] {
	if !req.Present {
		return nullable.Type[transaction.Record]{}
	}

	tr := transaction.Record{
		SourceID:     records.Record.ID,
		TargetID:     records.History.ID,
		SourceAmount: req.Balance.Val,
		TargetAmount: req.Balance.Val,
		IssuedAt:     req.At.OrElse(timestamp),
		ExecutedAt:   nullable.New(req.At.OrElse(timestamp)),
		UpdatedAt:    timestamp,
		CreatedAt:    timestamp,
	}

	if tr.SourceAmount < 0 {
		tr.SourceID, tr.TargetID = tr.TargetID, tr.SourceID
		tr.SourceAmount = -tr.SourceAmount
		tr.TargetAmount = -tr.TargetAmount
	}

	return nullable.New(tr)
}

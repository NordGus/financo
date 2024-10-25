package detailed_transaction_repository

import (
	"financo/core/scope_transactions/domain/responses"
	"financo/lib/color"
	"financo/lib/currency"
	"financo/lib/icon"
	"financo/lib/nullable"
	"financo/models/account"
	"time"
)

type rowPostgreSQL struct {
	ID                  int64
	IssuedAt            time.Time
	ExecutedAt          nullable.Type[time.Time]
	SourceAmount        int64
	TargetAmount        int64
	Notes               nullable.Type[string]
	CreatedAt           time.Time
	UpdatedAt           time.Time
	SrcID               int64
	SrcKind             account.Kind
	SrcCurrency         currency.Type
	SrcName             string
	SrcColor            color.Type
	SrcIcon             icon.Type
	SrcArchivedAt       nullable.Type[time.Time]
	SrcCreatedAt        time.Time
	SrcUpdatedAt        time.Time
	SrcParentID         nullable.Type[int64]
	SrcParentKind       nullable.Type[account.Kind]
	SrcParentCurrency   nullable.Type[currency.Type]
	SrcParentName       nullable.Type[string]
	SrcParentColor      nullable.Type[color.Type]
	SrcParentIcon       nullable.Type[icon.Type]
	SrcParentArchivedAt nullable.Type[time.Time]
	SrcParentCreatedAt  nullable.Type[time.Time]
	SrcParentUpdatedAt  nullable.Type[time.Time]
	TrgID               int64
	TrgKind             account.Kind
	TrgCurrency         currency.Type
	TrgName             string
	TrgColor            color.Type
	TrgIcon             icon.Type
	TrgArchivedAt       nullable.Type[time.Time]
	TrgCreatedAt        time.Time
	TrgUpdatedAt        time.Time
	TrgParentID         nullable.Type[int64]
	TrgParentKind       nullable.Type[account.Kind]
	TrgParentCurrency   nullable.Type[currency.Type]
	TrgParentName       nullable.Type[string]
	TrgParentColor      nullable.Type[color.Type]
	TrgParentIcon       nullable.Type[icon.Type]
	TrgParentArchivedAt nullable.Type[time.Time]
	TrgParentCreatedAt  nullable.Type[time.Time]
	TrgParentUpdatedAt  nullable.Type[time.Time]
}

func (row rowPostgreSQL) BuildTransaction() responses.Detailed {
	return responses.Detailed{
		ID:           row.ID,
		IssuedAt:     row.IssuedAt,
		ExecutedAt:   row.ExecutedAt,
		Source:       row.buildSourceAccount(),
		SourceAmount: row.SourceAmount,
		Target:       row.buildTargetAccount(),
		TargetAmount: row.TargetAmount,
		Notes:        row.Notes,
		CreatedAt:    row.CreatedAt,
		UpdatedAt:    row.UpdatedAt,
	}
}

func (row rowPostgreSQL) buildSourceAccount() responses.Account {
	return responses.Account{
		ID:         row.SrcID,
		Kind:       row.SrcKind,
		Currency:   row.SrcCurrency,
		Name:       row.SrcName,
		Color:      row.SrcColor,
		Icon:       row.SrcIcon,
		ArchivedAt: row.SrcArchivedAt,
		CreatedAt:  row.SrcCreatedAt,
		UpdatedAt:  row.SrcUpdatedAt,
		Parent:     row.buildSourceParentAccount(),
	}
}

func (row rowPostgreSQL) buildSourceParentAccount() nullable.Type[responses.AccountParent] {
	if row.SrcParentID.Valid {
		return nullable.New(responses.AccountParent{
			ID:         row.SrcParentID.Val,
			Kind:       row.SrcParentKind.Val,
			Currency:   row.SrcParentCurrency.Val,
			Name:       row.SrcParentName.Val,
			Color:      row.SrcParentColor.Val,
			Icon:       row.SrcParentIcon.Val,
			ArchivedAt: row.SrcParentArchivedAt,
			CreatedAt:  row.SrcParentCreatedAt.Val,
			UpdatedAt:  row.SrcParentUpdatedAt.Val,
		})
	}

	return nullable.Type[responses.AccountParent]{}
}

func (row rowPostgreSQL) buildTargetAccount() responses.Account {
	return responses.Account{
		ID:         row.TrgID,
		Kind:       row.TrgKind,
		Currency:   row.TrgCurrency,
		Name:       row.TrgName,
		Color:      row.TrgColor,
		Icon:       row.TrgIcon,
		ArchivedAt: row.TrgArchivedAt,
		CreatedAt:  row.TrgCreatedAt,
		UpdatedAt:  row.TrgUpdatedAt,
		Parent:     row.buildTargetParentAccount(),
	}
}

func (row rowPostgreSQL) buildTargetParentAccount() nullable.Type[responses.AccountParent] {
	if row.TrgParentID.Valid {
		return nullable.New(responses.AccountParent{
			ID:         row.TrgParentID.Val,
			Kind:       row.TrgParentKind.Val,
			Currency:   row.TrgParentCurrency.Val,
			Name:       row.TrgParentName.Val,
			Color:      row.TrgParentColor.Val,
			Icon:       row.TrgParentIcon.Val,
			ArchivedAt: row.TrgParentArchivedAt,
			CreatedAt:  row.TrgParentCreatedAt.Val,
			UpdatedAt:  row.TrgParentUpdatedAt.Val,
		})
	}

	return nullable.Type[responses.AccountParent]{}
}

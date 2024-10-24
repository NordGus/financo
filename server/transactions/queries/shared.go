package queries

import (
	"financo/core/domain/records/account"
	"financo/server/transactions/types/response"
	"financo/server/types/generic/nullable"
	"financo/server/types/shared/color"
	"financo/server/types/shared/currency"
	"financo/server/types/shared/icon"
	"time"
)

const (
	BaseQueryList = `
SELECT
    tr.id,
    tr.issued_at,
    tr.executed_at,
    tr.source_amount,
    tr.target_amount,
    tr.notes,
    tr.created_at,
    tr.updated_at,
    src.id,
    src.kind,
    src.currency,
    src.name,
    src.color,
    src.icon,
    src.archived_at,
    src.created_at,
    src.updated_at,
    srcp.id,
    srcp.kind,
    srcp.currency,
    srcp.name,
    srcp.color,
    srcp.icon,
    srcp.archived_at,
    srcp.created_at,
    srcp.updated_at,
    trg.id,
    trg.kind,
    trg.currency,
    trg.name,
    trg.color,
    trg.icon,
    trg.archived_at,
    trg.created_at,
    trg.updated_at,
    trgp.id,
    trgp.kind,
    trgp.currency,
    trgp.name,
    trgp.color,
    trgp.icon,
    trgp.archived_at,
    trgp.created_at,
    trgp.updated_at
FROM
    transactions tr
    INNER JOIN accounts src ON src.id = tr.source_id
    LEFT JOIN accounts srcp ON srcp.id = src.parent_id
    INNER JOIN accounts trg ON trg.id = tr.target_id
    LEFT JOIN accounts trgp ON trgp.id = trg.parent_id
WHERE
    tr.deleted_at IS NULL
	`
)

type BaseQueryListRow struct {
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
	SrcParentKind       nullable.Type[string]
	SrcParentCurrency   nullable.Type[string]
	SrcParentName       nullable.Type[string]
	SrcParentColor      nullable.Type[string]
	SrcParentIcon       nullable.Type[string]
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
	TrgParentKind       nullable.Type[string]
	TrgParentCurrency   nullable.Type[string]
	TrgParentName       nullable.Type[string]
	TrgParentColor      nullable.Type[string]
	TrgParentIcon       nullable.Type[string]
	TrgParentArchivedAt nullable.Type[time.Time]
	TrgParentCreatedAt  nullable.Type[time.Time]
	TrgParentUpdatedAt  nullable.Type[time.Time]
}

func BuildTransactions(row BaseQueryListRow) response.Detailed {
	return response.Detailed{
		ID:           row.ID,
		IssuedAt:     row.IssuedAt,
		ExecutedAt:   row.ExecutedAt,
		Source:       buildSourceAccount(row),
		SourceAmount: row.SourceAmount,
		Target:       buildTargetAccount(row),
		TargetAmount: row.TargetAmount,
		Notes:        row.Notes,
		CreatedAt:    row.CreatedAt,
		UpdatedAt:    row.UpdatedAt,
	}
}

func buildSourceAccount(row BaseQueryListRow) response.Account {
	return response.Account{
		ID:         row.SrcID,
		Kind:       row.SrcKind,
		Currency:   row.SrcCurrency,
		Name:       row.SrcName,
		Color:      row.SrcColor,
		Icon:       row.SrcIcon,
		ArchivedAt: row.SrcArchivedAt,
		CreatedAt:  row.SrcCreatedAt,
		UpdatedAt:  row.SrcUpdatedAt,
		Parent:     buildSourceParentAccount(row),
	}
}

func buildSourceParentAccount(row BaseQueryListRow) nullable.Type[response.AccountParent] {
	if row.SrcParentID.Valid {
		return nullable.New(response.AccountParent{
			ID:         row.SrcParentID.Val,
			Kind:       account.Kind(row.SrcParentKind.Val),
			Currency:   currency.Type(row.SrcParentCurrency.Val),
			Name:       row.SrcParentName.Val,
			Color:      color.Type(row.SrcParentColor.Val),
			Icon:       icon.Type(row.SrcParentIcon.Val),
			ArchivedAt: row.SrcParentArchivedAt,
			CreatedAt:  row.SrcParentCreatedAt.Val,
			UpdatedAt:  row.SrcParentUpdatedAt.Val,
		})
	}

	return nullable.Type[response.AccountParent]{}
}

func buildTargetAccount(row BaseQueryListRow) response.Account {
	return response.Account{
		ID:         row.TrgID,
		Kind:       row.TrgKind,
		Currency:   row.TrgCurrency,
		Name:       row.TrgName,
		Color:      row.TrgColor,
		Icon:       row.TrgIcon,
		ArchivedAt: row.TrgArchivedAt,
		CreatedAt:  row.TrgCreatedAt,
		UpdatedAt:  row.TrgUpdatedAt,
		Parent:     buildTargetParentAccount(row),
	}
}

func buildTargetParentAccount(row BaseQueryListRow) nullable.Type[response.AccountParent] {
	if row.TrgParentID.Valid {
		return nullable.New(response.AccountParent{
			ID:         row.TrgParentID.Val,
			Kind:       account.Kind(row.TrgParentKind.Val),
			Currency:   currency.Type(row.TrgParentCurrency.Val),
			Name:       row.TrgParentName.Val,
			Color:      color.Type(row.TrgParentColor.Val),
			Icon:       icon.Type(row.TrgParentIcon.Val),
			ArchivedAt: row.TrgParentArchivedAt,
			CreatedAt:  row.TrgParentCreatedAt.Val,
			UpdatedAt:  row.TrgParentUpdatedAt.Val,
		})
	}

	return nullable.Type[response.AccountParent]{}
}

package executed_transactions_repository

import (
	"context"
	"financo/core/domain/databases"
	"financo/core/scope_transactions/domain/filters"
	"financo/core/scope_transactions/domain/repositories"
	"financo/core/scope_transactions/domain/responses"
	"fmt"
)

type repository struct {
	db databases.SQLAdapter
}

func New(db databases.SQLAdapter) repositories.ExecutedTransactionsRepository {
	return &repository{
		db: db,
	}
}

const (
	queryStr = `
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
		tr.deleted_at IS NULL AND
	`
)

func (r *repository) Find(
	ctx context.Context, filter filters.TransactionsFilter,
) ([]responses.Detailed, error) {
	var (
		query = queryStr + `
			AND tr.executed_at IS NOT NULL
			AND (tr.executed_at BETWEEN $1 AND $2)
		`
		args        = make([]any, 0, 4)
		filterCount = 3

		res []responses.Detailed
	)

	args = append(args, filter.From.OrElse(filters.FromDefault()), filter.To.OrElse(filters.ToDefault()))

	if len(filter.AccountIDs) > 0 {
		query += fmt.Sprintf(" AND (tr.source_id = ANY ($%d) OR tr.target_id = ANY ($%d))", filterCount, filterCount)
		args = append(args, filter.AccountIDs)
		filterCount++
	}

	if len(filter.CategoryIDs) > 0 {
		query += fmt.Sprintf(" AND (tr.source_id = ANY ($%d) OR tr.target_id = ANY ($%d))", filterCount, filterCount)
		args = append(args, filter.CategoryIDs)
		filterCount++
	}

	res, err := r.find(ctx, query, args...)
	if err != nil {
		return res, err
	}

	return res, nil
}

func (r *repository) FindForAccount(
	ctx context.Context, filter filters.TransactionsForAccountFilter,
) ([]responses.Detailed, error) {
	var (
		query = queryStr + `
		AND tr.executed_at IS NOT NULL
		AND (src.id = $1 OR srcp.id = $1 OR trg.id = $1 OR trgp.id = $1)
		AND (tr.executed_at BETWEEN $2 AND $3)
		`
		args        = make([]any, 0, 5)
		filterCount = 4

		res []responses.Detailed
	)

	args = append(args, filter.ID, filter.From.OrElse(filters.FromDefault()), filter.To.OrElse(filters.ToDefault()))

	if len(filter.AccountIDs) > 0 {
		query += fmt.Sprintf(" AND (tr.source_id = ANY ($%d) OR tr.target_id = ANY ($%d))", filterCount, filterCount)
		args = append(args, filter.AccountIDs)
		filterCount++
	}

	if len(filter.CategoryIDs) > 0 {
		query += fmt.Sprintf(" AND (tr.source_id = ANY ($%d) OR tr.target_id = ANY ($%d))", filterCount, filterCount)
		args = append(args, filter.CategoryIDs)
		filterCount++
	}

	res, err := r.find(ctx, query, args...)
	if err != nil {
		return res, err
	}

	return res, nil
}

func (r *repository) find(ctx context.Context, query string, args ...any) ([]responses.Detailed, error) {
	res := make([]responses.Detailed, 0, 30)

	conn, err := r.db.Conn(ctx)
	if err != nil {
		return res, err
	}
	defer conn.Close()

	rows, err := conn.QueryContext(ctx, query, args...)
	if err != nil {
		return res, err
	}
	defer rows.Close()

	for rows.Next() {
		var row rowPostgreSQL

		err = rows.Scan(
			&row.ID,
			&row.IssuedAt,
			&row.ExecutedAt,
			&row.SourceAmount,
			&row.TargetAmount,
			&row.Notes,
			&row.CreatedAt,
			&row.UpdatedAt,
			&row.SrcID,
			&row.SrcKind,
			&row.SrcCurrency,
			&row.SrcName,
			&row.SrcColor,
			&row.SrcIcon,
			&row.SrcArchivedAt,
			&row.SrcCreatedAt,
			&row.SrcUpdatedAt,
			&row.SrcParentID,
			&row.SrcParentKind,
			&row.SrcParentCurrency,
			&row.SrcParentName,
			&row.SrcParentColor,
			&row.SrcParentIcon,
			&row.SrcParentArchivedAt,
			&row.SrcParentCreatedAt,
			&row.SrcParentUpdatedAt,
			&row.TrgID,
			&row.TrgKind,
			&row.TrgCurrency,
			&row.TrgName,
			&row.TrgColor,
			&row.TrgIcon,
			&row.TrgArchivedAt,
			&row.TrgCreatedAt,
			&row.TrgUpdatedAt,
			&row.TrgParentID,
			&row.TrgParentKind,
			&row.TrgParentCurrency,
			&row.TrgParentName,
			&row.TrgParentColor,
			&row.TrgParentIcon,
			&row.TrgParentArchivedAt,
			&row.TrgParentCreatedAt,
			&row.TrgParentUpdatedAt,
		)
		if err != nil {
			return res, err
		}

		res = append(res, row.BuildTransaction())
	}

	return res, nil
}

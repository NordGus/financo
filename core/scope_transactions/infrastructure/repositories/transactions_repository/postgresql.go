package transactions_repository

import (
	"context"
	"financo/core/domain/databases"
	"financo/core/scope_transactions/domain/filters"
	"financo/core/scope_transactions/domain/repositories"
	"financo/models/transaction"
	"fmt"
)

type Repository interface {
	repositories.TransactionsRepository
}

type repository struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) Repository {
	return &repository{
		db: db,
	}
}

func (r *repository) Where(ctx context.Context, f filters.List) ([]transaction.Record, error) {
	var (
		out   = make([]transaction.Record, 0, 50)
		args  = make([]any, 0, 4)
		count = 3
	)

	conn, err := r.db.Conn(ctx)
	if err != nil {
		return out, err
	}
	defer conn.Close()

	args = append(args, f.From.OrElse(filters.FromDefault()), f.To.OrElse(filters.ToDefault()))

	query := `
	SELECT
		tr.id,
		tr.source_id,
		tr.target_id,
		tr.issued_at,
		tr.executed_at,
		tr.source_amount,
		tr.target_amount,
		tr.notes,
		tr.created_at,
		tr.updated_at,
		tr.deleted_at
	FROM
		transactions tr
		INNER JOIN accounts src ON src.id = tr.source_id
		INNER JOIN accounts trg ON trg.id = tr.target_id
	WHERE
		tr.deleted_at IS NULL
		AND tr.executed_at IS NOT NULL
		AND (tr.executed_at BETWEEN $1 AND $2)
	`

	if len(f.AccountIDs) > 0 {
		query += fmt.Sprintf(" AND (src.id = ANY ($%d) OR trg.id = ANY ($%d))", count, count)
		args = append(args, f.AccountIDs)
		count++
	}

	if len(f.CategoryIDs) > 0 {
		query += fmt.Sprintf(" AND (src.id = ANY ($%d) OR trg.id = ANY ($%d))", count, count)
		args = append(args, f.CategoryIDs)
		count++
	}

	rows, err := conn.QueryContext(ctx, query, args...)

	if err != nil {
		return out, err
	}

	defer rows.Close()

	for rows.Next() {
		var r transaction.Record

		err = rows.Scan(
			&r.ID,
			&r.SourceID,
			&r.TargetID,
			&r.IssuedAt,
			&r.ExecutedAt,
			&r.SourceAmount,
			&r.TargetAmount,
			&r.Notes,
			&r.CreatedAt,
			&r.UpdatedAt,
			&r.DeletedAt,
		)
		if err != nil {
			return out, err
		}

		out = append(out, r)
	}

	return out, nil
}

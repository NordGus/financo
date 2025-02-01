package create_repository

import (
	"context"
	"database/sql"
	"financo/core/domain/databases"
	"financo/core/scope_transactions/domain/repositories"
	"financo/models/transaction"
)

type repository struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.CreateRepository {
	return &repository{
		db: db,
	}
}

func (r *repository) Save(ctx context.Context, record transaction.Record) (transaction.Record, error) {
	conn, err := r.db.Conn(ctx)
	if err != nil {
		return record, err
	}
	defer conn.Close()

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return record, err
	}

	record, err = create(ctx, tx, record)
	if err != nil {
		_ = tx.Rollback()
		return record, err
	}

	err = tx.Commit()
	if err != nil {
		return record, err
	}

	return record, nil
}

func create(ctx context.Context, tx *sql.Tx, record transaction.Record) (transaction.Record, error) {
	err := tx.QueryRowContext(
		ctx,
		`
		INSERT INTO transactions(
			source_id,
			target_id,
			source_amount,
			target_amount,
			notes,
			issued_at,
			executed_at,
			created_at,
			updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id
		`,
		record.SourceID,
		record.TargetID,
		record.SourceAmount,
		record.TargetAmount,
		record.Notes,
		record.IssuedAt,
		record.ExecutedAt,
		record.CreatedAt,
		record.UpdatedAt,
	).Scan(&record.ID)

	return record, err
}

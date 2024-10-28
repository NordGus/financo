package update_transaction_repository

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

func NewPostgreSQL(db databases.SQLAdapter) repositories.UpdateTransactionRepository {
	return &repository{
		db: db,
	}
}

func (r *repository) Save(ctx context.Context, record transaction.Record) error {
	conn, err := r.db.Conn(ctx)
	if err != nil {
		return err
	}
	defer conn.Close()

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	err = update(ctx, tx, record)
	if err != nil {
		_ = tx.Rollback()
		return err
	}

	err = tx.Commit()
	if err != nil {
		return err
	}

	return nil
}

func update(ctx context.Context, tx *sql.Tx, record transaction.Record) error {
	return tx.QueryRowContext(
		ctx,
		`
		UPDATE transactions SET
			source_id = $1,
			target_id = $2,
			source_amount = $3,
			target_amount = $4,
			notes = $5,
			issued_at = $6,
			executed_at = $7,
			updated_at = $8
		WHERE deleted_at IS NULL AND id = $9
		RETURNING id
		`,
		record.SourceID,
		record.TargetID,
		record.SourceAmount,
		record.TargetAmount,
		record.Notes,
		record.IssuedAt,
		record.ExecutedAt,
		record.UpdatedAt,
		record.ID,
	).Scan(&record.ID)
}

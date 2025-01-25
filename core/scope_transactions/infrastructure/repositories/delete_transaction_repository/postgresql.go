package delete_transaction_repository

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

func NewPostgreSQL(db databases.SQLAdapter) repositories.DeleteTransactionRepository {
	return &repository{
		db: db,
	}
}

func (r *repository) SoftDelete(ctx context.Context, record transaction.Record) error {
	conn, err := r.db.Conn(ctx)
	if err != nil {
		return err
	}
	defer conn.Close()

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	err = softDelete(ctx, tx, record)
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

func softDelete(ctx context.Context, tx *sql.Tx, record transaction.Record) error {
	_, err := tx.ExecContext(
		ctx,
		"UPDATE transactions SET deleted_at = $2, updated_at = $3 WHERE id = $1 AND deleted_at IS NULL",
		record.ID,
		record.DeletedAt,
		record.UpdatedAt,
	)

	return err
}

package transaction_repository

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

func NewPostgreSQL(db databases.SQLAdapter) repositories.TransactionRepository {
	return &repository{
		db: db,
	}
}

func (r *repository) Find(ctx context.Context, id int64) (transaction.Record, error) {
	var record transaction.Record

	conn, err := r.db.Conn(ctx)
	if err != nil {
		return record, err
	}
	defer conn.Close()

	record, err = find(ctx, conn, id)
	if err != nil {
		return record, err
	}

	return record, nil
}

func find(ctx context.Context, conn *sql.Conn, id int64) (transaction.Record, error) {
	var record transaction.Record

	err := conn.QueryRowContext(
		ctx,
		`
		SELECT
			id,
			source_id,
			target_id,
			source_amount,
			target_amount,
			notes,
			currency,
			issued_at,
			executed_at,
			deleted_at,
			created_at,
			updated_at,
			metadata
		FROM transactions
		WHERE deleted_at IS NULL
			AND id = $1
		`,
		id,
	).Scan(
		&record.ID,
		&record.SourceID,
		&record.TargetID,
		&record.SourceAmount,
		&record.TargetAmount,
		&record.Notes,
		&record.Currency,
		&record.IssuedAt,
		&record.ExecutedAt,
		&record.DeletedAt,
		&record.CreatedAt,
		&record.UpdatedAt,
		&record.Metadata,
	)

	return record, err
}

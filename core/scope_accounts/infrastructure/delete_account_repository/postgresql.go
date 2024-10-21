package delete_account_repository

import (
	"context"
	"database/sql"
	"financo/core/domain/databases"
	"financo/core/scope_accounts/domain/repositories"
	"financo/server/types/records/account"
	"time"
)

type repository struct {
	db        databases.SQLAdapter
	timestamp time.Time
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.DeleteAccountRepository {
	return &repository{
		db:        db,
		timestamp: time.Now().UTC(),
	}
}

func (r *repository) SoftDelete(ctx context.Context, id int64) (account.Record, error) {
	var record account.Record

	conn, err := r.db.Conn(ctx)
	if err != nil {
		return record, err
	}
	defer conn.Close()

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return record, err
	}
	defer tx.Rollback()

	deleted, err := r.softDeleteAccounts(ctx, tx, id)
	if err != nil {
		return record, err
	}

	err = r.softDeleteTransactions(ctx, tx, deleted)
	if err != nil {
		return record, err
	}

	record, err = r.find(ctx, tx, id)
	if err != nil {
		return record, err
	}

	return record, nil
}

func (r *repository) softDeleteAccounts(ctx context.Context, tx *sql.Tx, id int64) ([]int64, error) {
	var (
		output  = make([]int64, 0, 10)
		deleted int64
	)

	rows, err := tx.QueryContext(
		ctx,
		`
		UPDATE accounts
		SET deleted_at = $1, updated_at = $1
		WHERE (id = $2 OR parent_id = $2) AND deleted_at IS NULL
		RETURNING id
		`,
		r.timestamp,
		id,
	)
	if err != nil {
		return output, err
	}
	defer rows.Close()

	for rows.Next() {
		err = rows.Scan(&deleted)
		if err != nil {
			return output, err
		}

		output = append(output, deleted)
	}

	return output, nil
}

func (r *repository) softDeleteTransactions(ctx context.Context, tx *sql.Tx, ids []int64) error {
	_, err := tx.ExecContext(
		ctx,
		`
		UPDATE transactions
		SET deleted_at = $1, updated_at = $1
		WHERE (source_id = ANY ($2) OR target_id = ANY ($2)) AND deleted_at IS NULL
		`,
		r.timestamp,
		ids,
	)

	return err
}

func (r *repository) find(ctx context.Context, tx *sql.Tx, id int64) (account.Record, error) {
	var record account.Record

	err := tx.QueryRowContext(
		ctx,
		`
		SELECT
			id,
			parent_id,
			kind,
			currency,
			name,
			description,
			color,
			icon,
			capital,
			archived_at,
			deleted_at,
			created_at,
			updated_at
		FROM accounts
		WHERE id = $1
		`,
		id,
	).Scan(
		&record.ID,
		&record.ParentID,
		&record.Kind,
		&record.Currency,
		&record.Name,
		&record.Description,
		&record.Color,
		&record.Icon,
		&record.Capital,
		&record.ArchivedAt,
		&record.DeletedAt,
		&record.CreatedAt,
		&record.UpdatedAt,
	)

	return record, err
}

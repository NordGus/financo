package update_account_repository

import (
	"context"
	"database/sql"
	"financo/server/types/records/account"
	"financo/server/types/records/transaction"
)

func updateAccountRecord(ctx context.Context, tx *sql.Tx, record account.Record) error {
	_, err := tx.ExecContext(
		ctx,
		`
		UPDATE accounts
		SET
			parent_id = $2, kind = $3, currency = $4, name = $5, description = $5,
			color = $6, icon = $7, capital = $8, archived_at = $9, updated_at = $10
		WHERE id = $1
		`,
		record.ID,
		record.ParentID,
		record.Kind,
		record.Currency,
		record.Name,
		record.Description,
		record.Color,
		record.Icon,
		record.Capital,
		record.ArchivedAt,
		record.UpdatedAt,
	)

	return err
}

func createAccountRecord(ctx context.Context, tx *sql.Tx, record account.Record) error {
	_, err := tx.ExecContext(
		ctx,
		`
		INSERT INTO
			accounts(
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
			)
		VALUES
			($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		RETURNING id
		`,
		record.ParentID,
		record.Kind,
		record.Currency,
		record.Name,
		record.Description,
		record.Color,
		record.Icon,
		record.Capital,
		record.ArchivedAt,
		record.DeletedAt,
		record.CreatedAt,
		record.UpdatedAt,
	)

	return err
}

func createTransactionRecord(ctx context.Context, tx *sql.Tx, record transaction.Record) error {
	_, err := tx.ExecContext(
		ctx,
		`
		INSERT INTO transactions (
			source_id,
			target_id,
			source_amount,
			target_amount,
			notes,
			issued_at,
			executed_at,
			deleted_at,
			created_at,
			updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		`,
		record.SourceID,
		record.TargetID,
		record.SourceAmount,
		record.TargetAmount,
		record.Notes,
		record.IssuedAt,
		record.ExecutedAt,
		record.DeletedAt,
		record.CreatedAt,
		record.UpdatedAt,
	)

	return err
}

func updateTransactionRecord(ctx context.Context, tx *sql.Tx, record transaction.Record) error {
	_, err := tx.ExecContext(
		ctx,
		`
		UPDATE transactions
		SET
			source_id = $2,
			target_id = $3,
			source_amount = $4,
			target_amount = $5,
			notes = $6,
			issued_at = $7,
			executed_at = $8,
			deleted_at = $9,
			updated_at = $10
		WHERE id = $1
		`,
		record.ID,
		record.SourceID,
		record.TargetID,
		record.SourceAmount,
		record.TargetAmount,
		record.Notes,
		record.IssuedAt,
		record.ExecutedAt,
		record.DeletedAt,
		record.UpdatedAt,
	)

	return err
}

func deleteTransactionRecord(ctx context.Context, tx *sql.Tx, record account.Record, history account.Record) error {
	_, err := tx.ExecContext(
		ctx,
		`
		UPDATE transactions
		SET deleted_at = $1, updated_at = $2
		WHERE (source_id = $2 AND target_id = $3) OR (source_id = $3 AND target_id = $2)
		`,
		record.UpdatedAt,
		record.ID,
		history.ID,
	)

	return err
}

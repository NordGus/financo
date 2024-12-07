package create_repository

import (
	"context"
	"database/sql"
	"financo/core/domain/databases"
	"financo/core/scope_accounts/domain/repositories"
	"financo/lib/nullable"
	"financo/models/account"
	"financo/models/transaction"
)

type repository struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.CreateAccountRepository {
	return &repository{
		db: db,
	}
}

func (r *repository) Save(ctx context.Context, args repositories.CreateAccountSaveArgs) (account.Record, error) {
	conn, err := r.db.Conn(ctx)
	if err != nil {
		return args.Record, err
	}
	defer conn.Close()

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return args.Record, err
	}

	if args.Record.DynamicData.Main {
		err = r.unmarkPreviousMainAccount(ctx, tx)
		if err != nil {
			_ = tx.Rollback()
			return args.Record, err
		}
	}

	args.Record, err = r.persistAccount(ctx, tx, args.Record)
	if err != nil {
		_ = tx.Rollback()
		return args.Record, err
	}

	args.History.ParentID = nullable.New(args.Record.ID)

	args.History, err = r.persistAccount(ctx, tx, args.History)
	if err != nil {
		_ = tx.Rollback()
		return args.Record, err
	}

	if args.Interest.Valid {
		args.Interest.Val.ParentID = nullable.New(args.Record.ID)

		args.Interest.Val, err = r.persistAccount(ctx, tx, args.Interest.Val)
		if err != nil {
			_ = tx.Rollback()
			return args.Record, err
		}
	}

	args.HistoryTransaction = prepareHistoryTransaction(args.HistoryTransaction, args.Record, args.History)

	if hasToPersistHistoryTransaction(args.HistoryTransaction) {
		args.HistoryTransaction.Val, err = r.persistTransaction(ctx, tx, args.HistoryTransaction.Val)
		if err != nil {
			_ = tx.Rollback()
			return args.Record, err
		}
	}

	err = tx.Commit()
	if err != nil {
		_ = tx.Rollback()
		return args.Record, err
	}

	return args.Record, nil
}

func (r *repository) unmarkPreviousMainAccount(ctx context.Context, tx *sql.Tx) error {
	_, err := tx.ExecContext(
		ctx,
		`
		UPDATE accounts
		SET dynamic_data = jsonb_set(dynamic_data::jsonb, '{main}', to_jsonb($2::boolean))
		WHERE dynamic_data->'main' = to_jsonb($1::boolean)
		`,
		true,
		false,
	)

	return err
}

func (r *repository) persistAccount(ctx context.Context, tx *sql.Tx, record account.Record) (account.Record, error) {
	err := tx.QueryRowContext(
		ctx,
		`
		INSERT INTO accounts(
			parent_id,
			kind,
			currency,
			name,
			description,
			color,
			icon,
			capital,
			dynamic_data,
			created_at,
			updated_at
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
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
		record.DynamicData,
		record.CreatedAt,
		record.UpdatedAt,
	).Scan(&record.ID)

	return record, err
}

func (r *repository) persistTransaction(
	ctx context.Context, tx *sql.Tx, record transaction.Record,
) (transaction.Record, error) {
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

func prepareHistoryTransaction(
	tr nullable.Type[transaction.Record], r account.Record, h account.Record,
) nullable.Type[transaction.Record] {
	if !tr.Valid {
		return tr
	}

	if tr.Val.SourceAmount > 0 {
		tr.Val.SourceID = h.ID
		tr.Val.TargetID = r.ID
	}

	if tr.Val.SourceAmount < 0 {
		tr.Val.SourceID = r.ID
		tr.Val.TargetID = h.ID
		tr.Val.SourceAmount = tr.Val.SourceAmount * -1
		tr.Val.TargetAmount = tr.Val.TargetAmount * -1
	}

	return tr
}

func hasToPersistHistoryTransaction(tr nullable.Type[transaction.Record]) bool {
	return tr.Valid && tr.Val.SourceID != -1 && tr.Val.TargetID != -1
}

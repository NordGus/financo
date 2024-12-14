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

type postgresql struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.CreateAccountRepository {
	return &postgresql{
		db: db,
	}
}

func (p *postgresql) Save(ctx context.Context, args repositories.CreateAccountSaveArgs) (account.Record, error) {
	conn, err := p.db.Conn(ctx)
	if err != nil {
		return args.Record, err
	}
	defer conn.Close()

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return args.Record, err
	}

	if args.Record.DynamicData.Main {
		err = p.unmarkPreviousMainAccount(ctx, tx)
		if err != nil {
			_ = tx.Rollback()
			return args.Record, err
		}
	}

	args.Record, err = p.persistAccount(ctx, tx, args.Record)
	if err != nil {
		_ = tx.Rollback()
		return args.Record, err
	}

	args.History.ParentID = nullable.New(args.Record.ID)

	args.History, err = p.persistAccount(ctx, tx, args.History)
	if err != nil {
		_ = tx.Rollback()
		return args.Record, err
	}

	if args.Interest.Valid {
		args.Interest.Val.ParentID = nullable.New(args.Record.ID)

		args.Interest.Val, err = p.persistAccount(ctx, tx, args.Interest.Val)
		if err != nil {
			_ = tx.Rollback()
			return args.Record, err
		}
	}

	args.HistoryTransaction = prepareHistoryTransaction(args.HistoryTransaction, args.Record, args.History)

	args.HistoryTransaction, err = p.persistTransaction(ctx, tx, args.HistoryTransaction)
	if err != nil {
		_ = tx.Rollback()
		return args.Record, err
	}

	err = tx.Commit()
	if err != nil {
		_ = tx.Rollback()
		return args.Record, err
	}

	return args.Record, nil
}

func (p *postgresql) unmarkPreviousMainAccount(ctx context.Context, tx *sql.Tx) error {
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

func (p *postgresql) persistAccount(ctx context.Context, tx *sql.Tx, record account.Record) (account.Record, error) {
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

func (p *postgresql) persistTransaction(
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

func prepareHistoryTransaction(tr transaction.Record, r account.Record, h account.Record) transaction.Record {
	if tr.SourceAmount >= 0 {
		tr.SourceID = h.ID
		tr.TargetID = r.ID
	}

	if tr.SourceAmount < 0 {
		tr.SourceID = r.ID
		tr.TargetID = h.ID
		tr.SourceAmount = tr.SourceAmount * -1
		tr.TargetAmount = tr.TargetAmount * -1
	}

	return tr
}

package update_repository

import (
	"context"
	"database/sql"
	"financo/core/domain/databases"
	"financo/core/scope_accounts/domain/repositories"
	"financo/models/account"
	"financo/models/transaction"
)

type postgresql struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.UpdateAccountRepository {
	return &postgresql{
		db: db,
	}
}

func (p *postgresql) Find(ctx context.Context, id int64) (repositories.UpdateAccountState, error) {
	var state repositories.UpdateAccountState

	conn, err := p.db.Conn(ctx)
	if err != nil {
		return state, err
	}
	defer conn.Close()

	state.Record, err = p.findRecord(ctx, conn, id)
	if err != nil {
		return state, err
	}

	state.History, err = p.findHistoryRecord(ctx, conn, id)
	if err != nil {
		return state, err
	}

	state.Transaction, err = p.findTransaction(ctx, conn, state.Record.ID, state.History.ID)
	if err != nil {
		return state, err
	}

	return state, nil
}

func (p *postgresql) Save(ctx context.Context, state repositories.UpdateAccountState) error {
	conn, err := p.db.Conn(ctx)
	if err != nil {
		return err
	}
	defer conn.Close()

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	err = p.persistAccount(ctx, tx, state.Record)
	if err != nil {
		_ = tx.Rollback()
		return err
	}

	err = p.persistAccount(ctx, tx, state.History)
	if err != nil {
		_ = tx.Rollback()
		return err
	}

	err = p.persistTransaction(ctx, tx, state.Transaction)
	if err != nil {
		_ = tx.Rollback()
		return err
	}

	err = tx.Commit()
	if err != nil {
		_ = tx.Rollback()
		return err
	}

	return nil
}

func (p *postgresql) findRecord(ctx context.Context, conn *sql.Conn, id int64) (account.Record, error) {
	var r account.Record

	err := conn.QueryRowContext(
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
			updated_at,
			dynamic_data
		FROM accounts
		WHERE
			deleted_at IS NULL
			AND kind = ANY ($2)
			AND id = $1
		`,
		id,
		[]account.Kind{
			account.CapitalNormal,
			account.CapitalSavings,
			account.DebtCredit,
			account.DebtLoan,
			account.DebtPersonal,
		},
	).Scan(
		&r.ID,
		&r.ParentID,
		&r.Kind,
		&r.Currency,
		&r.Name,
		&r.Description,
		&r.Color,
		&r.Icon,
		&r.Capital,
		&r.ArchivedAt,
		&r.DeletedAt,
		&r.CreatedAt,
		&r.UpdatedAt,
		&r.DynamicData,
	)

	return r, err
}

func (p *postgresql) findHistoryRecord(ctx context.Context, conn *sql.Conn, id int64) (account.Record, error) {
	var r account.Record

	err := conn.QueryRowContext(
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
			updated_at,
			dynamic_data
		FROM accounts
		WHERE
			deleted_at IS NULL
			AND kind = $2
			AND parent_id = $1
		`,
		id,
		account.SystemHistoric,
	).Scan(
		&r.ID,
		&r.ParentID,
		&r.Kind,
		&r.Currency,
		&r.Name,
		&r.Description,
		&r.Color,
		&r.Icon,
		&r.Capital,
		&r.ArchivedAt,
		&r.DeletedAt,
		&r.CreatedAt,
		&r.UpdatedAt,
		&r.DynamicData,
	)

	return r, err
}

func (p *postgresql) findTransaction(
	ctx context.Context, conn *sql.Conn, id int64, hid int64,
) (transaction.Record, error) {
	var r transaction.Record

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
			issued_at,
			executed_at,
			deleted_at,
			created_at,
			updated_at
		FROM transactions
		WHERE
			(source_id = $1 AND target_id = $2)
			OR (source_id = $2 AND target_id = $1)
		`,
		id,
		hid,
	).Scan(
		&r.ID,
		&r.SourceID,
		&r.TargetID,
		&r.SourceAmount,
		&r.TargetAmount,
		&r.Notes,
		&r.IssuedAt,
		&r.ExecutedAt,
		&r.DeletedAt,
		&r.CreatedAt,
		&r.UpdatedAt,
	)

	return r, err
}

func (p *postgresql) persistAccount(ctx context.Context, tx *sql.Tx, r account.Record) error {
	err := tx.QueryRowContext(
		ctx,
		`
		UPDATE accounts
		SET
			parent_id = $2, kind = $3, currency = $4, name = $5, description = $6, color = $7, icon = $8,
			capital = $9, archived_at = $10, deleted_at = $11, created_at = $12, updated_at = $13, dynamic_data = $14
		WHERE id = $1
		RETURNING id
		`,
		r.ID,
		r.ParentID,
		r.Kind,
		r.Currency,
		r.Name,
		r.Description,
		r.Color,
		r.Icon,
		r.Capital,
		r.ArchivedAt,
		r.DeletedAt,
		r.CreatedAt,
		r.UpdatedAt,
		r.DynamicData,
	).Scan(&r.ID)

	return err
}

func (p *postgresql) persistTransaction(ctx context.Context, tx *sql.Tx, r transaction.Record) error {
	err := tx.QueryRowContext(
		ctx,
		`
		UPDATE transactions
		SET
			source_id = $2, target_id = $3, source_amount = $4, target_amount = $5, notes = $6, issued_at = $7,
			executed_at = $8, deleted_at = $9, created_at = $10, updated_at = $11
		WHERE id = $1
		RETURNING id
		`,
		&r.ID,
		&r.SourceID,
		&r.TargetID,
		&r.SourceAmount,
		&r.TargetAmount,
		&r.Notes,
		&r.IssuedAt,
		&r.ExecutedAt,
		&r.DeletedAt,
		&r.CreatedAt,
		&r.UpdatedAt,
	).Scan(&r.ID)

	return err
}

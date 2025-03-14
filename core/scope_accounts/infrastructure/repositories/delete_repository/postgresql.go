package delete_repository

import (
	"context"
	"database/sql"
	"financo/core/domain/databases"
	"financo/core/scope_accounts/domain/repositories"
	"financo/models/account"
)

type postgresql struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.DeleteAccountRepository {
	return &postgresql{
		db: db,
	}
}

func (p *postgresql) Find(ctx context.Context, id int64) (account.Record, error) {
	var r account.Record

	conn, err := p.db.Conn(ctx)
	if err != nil {
		return r, err
	}
	defer conn.Close()

	err = conn.QueryRowContext(
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
			account.Capital,
			account.Savings,
			account.DebtCredit,
			account.Debt,
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

func (p *postgresql) SoftDelete(ctx context.Context, r account.Record) error {
	conn, err := p.db.Conn(ctx)
	if err != nil {
		return err
	}
	defer conn.Close()

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	ids, err := p.softDeleteAccounts(ctx, tx, r)
	if err != nil {
		return err
	}

	err = p.softDeleteTransactions(ctx, tx, ids, r)
	if err != nil {
		return err
	}

	err = tx.Commit()
	if err != nil {
		_ = tx.Rollback()
		return err
	}

	return nil
}

func (p *postgresql) softDeleteAccounts(ctx context.Context, tx *sql.Tx, r account.Record) ([]int64, error) {
	ids := make([]int64, 0, 10)

	rows, err := tx.QueryContext(
		ctx,
		`
		UPDATE accounts
		SET deleted_at = $2, updated_at = $3
		WHERE deleted_at IS NULL AND (id = $1 OR parent_id = $1)
		RETURNING id
		`,
		r.ID,
		r.DeletedAt,
		r.UpdatedAt,
	)
	if err != nil {
		return ids, err
	}
	defer rows.Close()

	for rows.Next() {
		var id int64

		err = rows.Scan(&id)
		if err != nil {
			return ids, err
		}

		ids = append(ids, id)
	}

	return ids, nil
}

func (p *postgresql) softDeleteTransactions(ctx context.Context, tx *sql.Tx, ids []int64, r account.Record) error {
	_, err := tx.ExecContext(
		ctx,
		`
		UPDATE transactions
		SET deleted_at = $2, updated_at = $3
		WHERE (source_id = ANY ($1) OR target_id = ANY ($1)) AND deleted_at IS NULL
		`,
		ids,
		r.DeletedAt,
		r.UpdatedAt,
	)

	return err
}

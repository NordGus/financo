package accounts_repository

import (
	"context"
	"financo/core/domain/databases"
	"financo/core/scope_accounts/domain/filters"
	"financo/core/scope_accounts/domain/repositories"
	"financo/models/account"
)

type Repository interface {
	repositories.AccountRepository
	repositories.AccountsRepository
}

type postgresql struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) Repository {
	return &postgresql{
		db: db,
	}
}

func (p *postgresql) Find(ctx context.Context, id int64) (account.Record, error) {
	var record account.Record

	conn, err := p.db.Conn(ctx)
	if err != nil {
		return record, err
	}
	defer conn.Close()

	err = conn.QueryRowContext(
		ctx,
		`
		SELECT
			acc.id,
			acc.parent_id,
			acc.kind,
			acc.currency,
			acc.name,
			acc.description,
			acc.capital,
			acc.color,
			acc.icon,
			acc.archived_at,
			acc.deleted_at,
			acc.created_at,
			acc.updated_at,
			acc.dynamic_data
		FROM
			accounts acc
		WHERE
			acc.deleted_at IS NULL
			AND acc.id = $1
		`,
		id,
	).Scan(
		&record.ID,
		&record.ParentID,
		&record.Kind,
		&record.Currency,
		&record.Name,
		&record.Description,
		&record.Capital,
		&record.Color,
		&record.Icon,
		&record.ArchivedAt,
		&record.DeletedAt,
		&record.CreatedAt,
		&record.UpdatedAt,
		&record.DynamicData,
	)

	return record, err
}

func (p *postgresql) FindChildren(ctx context.Context, parentID int64) ([]account.Record, error) {
	var res = make([]account.Record, 0, 10)

	conn, err := p.db.Conn(ctx)
	if err != nil {
		return res, err
	}
	defer conn.Close()

	rows, err := conn.QueryContext(
		ctx,
		`
		SELECT
			acc.id,
			acc.parent_id,
			acc.kind,
			acc.currency,
			acc.name,
			acc.description,
			acc.capital,
			acc.color,
			acc.icon,
			acc.archived_at,
			acc.deleted_at,
			acc.created_at,
			acc.updated_at,
			acc.dynamic_data
		FROM
			accounts acc
		WHERE
			acc.deleted_at IS NULL
			AND acc.parent_id = $1
		`,
		parentID,
	)
	if err != nil {
		return res, err
	}
	defer rows.Close()

	for rows.Next() {
		var child account.Record

		err = rows.Scan(
			&child.ID,
			&child.ParentID,
			&child.Kind,
			&child.Currency,
			&child.Name,
			&child.Description,
			&child.Capital,
			&child.Color,
			&child.Icon,
			&child.ArchivedAt,
			&child.DeletedAt,
			&child.CreatedAt,
			&child.UpdatedAt,
			&child.DynamicData,
		)
		if err != nil {
			return res, err
		}

		res = append(res, child)
	}

	return res, nil
}

func (p *postgresql) Where(ctx context.Context, f filters.Accounts) ([]account.Record, error) {
	var res = make([]account.Record, 0, 10)

	conn, err := p.db.Conn(ctx)
	if err != nil {
		return res, err
	}
	defer conn.Close()

	query := `
	SELECT
		acc.id,
		acc.parent_id,
		acc.kind,
		acc.currency,
		acc.name,
		acc.description,
		acc.capital,
		acc.color,
		acc.icon,
		acc.archived_at,
		acc.deleted_at,
		acc.created_at,
		acc.updated_at,
		acc.dynamic_data
	FROM
		accounts acc
	WHERE
		acc.deleted_at IS NULL
		AND acc.parent_id IS NULL
		AND acc.kind = ANY($1)
		AND acc.currency = ANY($2)
	`

	if f.Archived.Valid && f.Archived.Val {
		query += " AND acc.archived_at IS NOT NULL"
	}

	if f.Archived.Valid && !f.Archived.Val {
		query += " AND acc.archived_at IS NULL"
	}

	rows, err := conn.QueryContext(ctx, query, f.Kinds, f.Currencies)
	if err != nil {
		return res, err
	}
	defer rows.Close()

	for rows.Next() {
		var r account.Record

		err = rows.Scan(
			&r.ID,
			&r.ParentID,
			&r.Kind,
			&r.Currency,
			&r.Name,
			&r.Description,
			&r.Capital,
			&r.Color,
			&r.Icon,
			&r.ArchivedAt,
			&r.DeletedAt,
			&r.CreatedAt,
			&r.UpdatedAt,
			&r.DynamicData,
		)
		if err != nil {
			return res, err
		}

		res = append(res, r)
	}

	return res, nil
}

package accounts_repository

import (
	"context"
	"financo/core/domain/databases"
	"financo/core/scope_accounts/domain/filters"
	"financo/core/scope_accounts/domain/repositories"
	"financo/models/account"
)

type repository struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.AccountsRepository {
	return &repository{
		db: db,
	}
}

func (r *repository) Where(ctx context.Context, f filters.Accounts) ([]account.Record, error) {
	var res = make([]account.Record, 0, 10)

	conn, err := r.db.Conn(ctx)
	if err != nil {
		return res, err
	}
	defer conn.Close()

	query := `
	SELECT
		acc.id,
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
		AND acc.kind != $1
	`

	rows, err := conn.QueryContext(ctx, query, account.SystemHistoric)
	if err != nil {
		return res, err
	}
	defer rows.Close()

	for rows.Next() {
		var r account.Record

		err = rows.Scan(
			&r.ID,
			&r.Kind,
			&r.Currency,
			&r.Name,
			&r.Description,
			&r.Capital,
			&r.Color,
			&r.Icon,
			&r.ArchivedAt,
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

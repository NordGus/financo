package accounts_repository

import (
	"context"
	"financo/core/domain/databases"
	"financo/core/scope_transactions/domain/repositories"
	"financo/models/account"
)

type Repository interface {
	repositories.AccountsRepository
}

type repository struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) Repository {
	return &repository{
		db: db,
	}
}

func (r *repository) Where(ctx context.Context) ([]account.Record, error) {
	var res = make([]account.Record, 0, 10)

	conn, err := r.db.Conn(ctx)
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
	`

	rows, err := conn.QueryContext(ctx, query)
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

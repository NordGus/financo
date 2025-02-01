package accounts_repository

import (
	"context"
	"financo/core/domain/databases"
	"financo/models/account"
)

type Repository interface {
	Get(ctx context.Context) ([]account.Record, error)
}

type repository struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) Repository {
	return &repository{
		db: db,
	}
}

func (r *repository) Get(ctx context.Context) ([]account.Record, error) {
	out := make([]account.Record, 0, 30)

	conn, err := r.db.Conn(ctx)
	if err != nil {
		return out, err
	}
	defer conn.Close()

	conn.QueryContext(ctx,
		`
		SELECT
			acc.id,
			acc.parent_id,
			acc.kind,
			acc.currency,
			acc.name,
			acc.description,
			acc.color,
			acc.icon,
			acc.dynamic_data->'balance' as balance,
			acc.dynamic_data->'main' as main,
			acc.archived_at,
			acc.deleted_at,
			acc.created_at,
			acc.updated_at
		FROM
			accounts acc
		WHERE acc.deleted_at IS NULL
		ORDER BY acc.parent_id NULLS FIRST, acc.id
		`,
	)

	return out, err
}

package account_repository

import (
	"context"
	"database/sql"
	"financo/core/domain/databases"
	"financo/core/domain/repositories"
	"financo/models/account"
)

type postgresql struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.AccountRepository {
	return &postgresql{
		db: db,
	}
}

func (r *postgresql) Find(ctx context.Context, id int64) (account.Record, error) {
	var record account.Record

	conn, err := r.db.Conn(ctx)
	if err != nil {
		return record, err
	}
	defer conn.Close()

	record, err = r.find(ctx, conn, id)
	if err != nil {
		return record, err
	}

	return record, nil
}

func (r *postgresql) find(ctx context.Context, conn *sql.Conn, id int64) (account.Record, error) {
	var record account.Record

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
			updated_at
		FROM accounts
		WHERE deleted_at IS NULL
			AND id = $1
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

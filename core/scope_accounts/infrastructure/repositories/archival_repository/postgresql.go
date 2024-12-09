package archival_repository

import (
	"context"
	"financo/core/domain/databases"
	"financo/core/scope_accounts/domain/repositories"
	"financo/lib/nullable"
	"time"
)

type postgresql struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.ArchivalRepository {
	return &postgresql{
		db: db,
	}
}

func (r *postgresql) Archive(ctx context.Context, id int64, at nullable.Type[time.Time], timestamp time.Time) error {
	conn, err := r.db.Conn(ctx)
	if err != nil {
		return err
	}
	defer conn.Close()

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(
		ctx,
		`
		UPDATE accounts
		SET archived_at = $2, updated_at = $3
		WHERE id = $1 OR parent_id = $1
		`,
		id,
		at,
		timestamp,
	)
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

package archival_repository

import (
	"context"
	"financo/core/domain/databases"
	"financo/core/scope_categories/domain/repositories"
	"financo/lib/nullable"
	"financo/models/account"
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

func (p *postgresql) Archive(ctx context.Context, id int64, timestamp time.Time) error {
	conn, err := p.db.Conn(ctx)
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
		SET archived_at = $3, updated_at = $4
		WHERE
			(id = $1 OR parent_id = $1)
			AND kind = ANY($2)
			AND archived_at IS NULL
			AND deleted_at IS NULL
		`,
		id,
		[]account.Kind{
			account.ExternalExpense,
			account.ExternalIncome,
		},
		nullable.New(timestamp),
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

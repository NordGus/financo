package archival_repository

import (
	"context"
	"financo/core/domain/databases"
	"financo/core/scope_categories/domain/models/category"
	"financo/core/scope_categories/domain/repositories"
	"financo/lib/nullable"
	"financo/models/account"
	"time"
)

type Repository interface {
	repositories.ArchiveRepository
	repositories.UnarchiveRepository
}

type postgresql struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) Repository {
	return &postgresql{
		db: db,
	}
}

func (p *postgresql) Archive(ctx context.Context, r category.Record, timestamp time.Time) (category.Record, error) {
	archive := nullable.New(timestamp)

	conn, err := p.db.Conn(ctx)
	if err != nil {
		return r, err
	}
	defer conn.Close()

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return r, err
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
		r.Parent.ID,
		[]account.Kind{
			account.ExternalExpense,
			account.ExternalIncome,
		},
		archive,
		timestamp,
	)
	if err != nil {
		_ = tx.Rollback()
		return r, err
	}

	err = tx.Commit()
	if err != nil {
		_ = tx.Rollback()
		return r, err
	}

	r.Parent.ArchivedAt = archive
	r.Parent.UpdatedAt = timestamp

	for i := 0; i < len(r.Children); i++ {
		r.Children[i].ArchivedAt = archive
		r.Children[i].UpdatedAt = timestamp
	}

	return r, nil
}

func (p *postgresql) Unarchive(ctx context.Context, r category.Record, timestamp time.Time) (category.Record, error) {
	var archive nullable.Type[time.Time]

	conn, err := p.db.Conn(ctx)
	if err != nil {
		return r, err
	}
	defer conn.Close()

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return r, err
	}

	_, err = tx.ExecContext(
		ctx,
		`
		UPDATE accounts
		SET archived_at = $3, updated_at = $4
		WHERE
			id = $1
			AND kind = ANY($2)
			AND deleted_at IS NULL
		`,
		r.Parent.ID,
		[]account.Kind{
			account.ExternalExpense,
			account.ExternalIncome,
		},
		archive,
		timestamp,
	)
	if err != nil {
		_ = tx.Rollback()
		return r, err
	}

	err = tx.Commit()
	if err != nil {
		_ = tx.Rollback()
		return r, err
	}

	r.Parent.ArchivedAt = archive
	r.Parent.UpdatedAt = timestamp

	for i := 0; i < len(r.Children); i++ {
		r.Children[i].ArchivedAt = archive
		r.Children[i].UpdatedAt = timestamp
	}

	return r, nil
}

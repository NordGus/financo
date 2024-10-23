package update_account_repository

import (
	"context"
	"database/sql"
	"errors"
	"financo/core/domain/databases"
	"financo/core/scope_accounts/domain/repositories"
	"financo/core/scope_accounts/domain/responses"
	"financo/server/types/records/account"
)

type repository struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.UpdateAccountRepository {
	return &repository{
		db: db,
	}
}

func (r *repository) FindWithChildren(ctx context.Context, id int64) (repositories.AccountWithChildren, error) {
	var (
		children []account.Record
		record   account.Record
		out      repositories.AccountWithChildren
	)

	conn, err := r.db.Conn(ctx)
	if err != nil {
		return out, err
	}
	defer conn.Close()

	record, err = findRecord(ctx, conn, id)
	if err != nil {
		return out, err
	}

	children, err = findChildrenRecords(ctx, conn, record.ID)
	if err != nil {
		return out, err
	}

	out = repositories.AccountWithChildren{
		Record:   record,
		Children: children,
	}

	return out, nil
}

func (r *repository) FindWithHistory(ctx context.Context, id int64) (repositories.AccountWithHistory, error) {
	var (
		record  account.Record
		history account.Record
		out     repositories.AccountWithHistory
	)

	conn, err := r.db.Conn(ctx)
	if err != nil {
		return out, err
	}
	defer conn.Close()

	record, err = findRecord(ctx, conn, id)
	if err != nil {
		return out, err
	}

	history, err = findHistoryRecord(ctx, conn, record.ID)
	if err != nil {
		return out, err
	}

	out = repositories.AccountWithHistory{
		Record:  record,
		History: history,
	}

	return out, nil
}

// SaveWithChildren implements repositories.UpdateAccountRepository.
func (r *repository) SaveWithChildren(
	ctx context.Context,
	args repositories.SaveAccountWithChildrenArgs,
) (responses.Detailed, error) {
	return responses.Detailed{}, errors.New("not implemented")
}

// SaveWithHistory implements repositories.UpdateAccountRepository.
func (r *repository) SaveWithHistory(
	ctx context.Context,
	args repositories.SaveAccountWithHistoryArgs,
) (responses.Detailed, error) {
	return responses.Detailed{}, errors.New("not implemented")
}

func findRecord(ctx context.Context, conn *sql.Conn, id int64) (account.Record, error) {
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
		WHERE
			id = $1 AND
			kind != $2 AND
			deleted_at IS NULL AND
			parent_id IS NULL
		`,
		id,
		account.SystemHistoric,
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

func findChildrenRecords(ctx context.Context, conn *sql.Conn, parentID int64) ([]account.Record, error) {
	children := make([]account.Record, 0, 10)

	rows, err := conn.QueryContext(
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
		WHERE
			parent_id = $1 AND
			kind != $2 AND
			deleted_at IS NULL
		`,
		parentID,
		account.SystemHistoric,
	)
	if err != nil {
		return children, err
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
			&child.Color,
			&child.Icon,
			&child.Capital,
			&child.ArchivedAt,
			&child.DeletedAt,
			&child.CreatedAt,
			&child.UpdatedAt,
		)
		if err != nil {
			return children, err
		}

		children = append(children, child)
	}

	return children, nil
}

func findHistoryRecord(ctx context.Context, conn *sql.Conn, parentID int64) (account.Record, error) {
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
		WHERE
			parent_id = $1 AND
			kind = $2 AND
			deleted_at IS NULL
		`,
		parentID,
		account.SystemHistoric,
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

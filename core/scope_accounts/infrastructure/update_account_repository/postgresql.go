package update_account_repository

import (
	"context"
	"database/sql"
	"errors"
	"financo/core/domain/databases"
	"financo/core/scope_accounts/domain/repositories"
	"financo/core/scope_accounts/domain/responses"
	"financo/server/types/generic/nullable"
	"financo/server/types/records/account"
	"time"
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

func (r *repository) SaveWithChildren(
	ctx context.Context,
	args repositories.SaveAccountWithChildrenArgs,
) (responses.Detailed, error) {
	var res responses.Detailed

	conn, err := r.db.Conn(ctx)
	if err != nil {
		return res, err
	}
	defer conn.Close()

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return res, err
	}
	defer tx.Rollback()

	err = updateAccount(ctx, tx, args.Record)
	if err != nil {
		return res, err
	}

	for _, child := range args.Children {
		if child.ID <= 0 {
			err = createAccount(ctx, tx, child)
		} else {
			err = updateAccount(ctx, tx, child)
		}

		if err != nil {
			return res, err
		}
	}

	err = tx.Commit()
	if err != nil {
		return res, err
	}

	res, err = findResponseDetailed(ctx, conn, args.Record)
	if err != nil {
		return res, err
	}

	return res, nil
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
			id, parent_id, kind, currency, name, description, color, icon,
			capital, archived_at, deleted_at, created_at, updated_at
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
			id, parent_id, kind, currency, name, description, color, icon,
			capital, archived_at, deleted_at, created_at, updated_at
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
			id, parent_id, kind, currency, name, description, color, icon,
			capital, archived_at, deleted_at, created_at, updated_at
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

func updateAccount(ctx context.Context, tx *sql.Tx, record account.Record) error {
	_, err := tx.ExecContext(
		ctx,
		`
		UPDATE accounts
		SET
			parent_id = $2, kind = $3, currency = $4, name = $5, description = $5,
			color = $6, icon = $7, capital = $8, archived_at = $9, updated_at = $10
		WHERE id = $1
		`,
		record.ID,
		record.ParentID,
		record.Kind,
		record.Currency,
		record.Name,
		record.Description,
		record.Color,
		record.Icon,
		record.Capital,
		record.ArchivedAt,
		record.UpdatedAt,
	)

	return err
}

func createAccount(ctx context.Context, tx *sql.Tx, record account.Record) error {
	_, err := tx.ExecContext(
		ctx,
		`
		INSERT INTO
			accounts(
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
			)
		VALUES
			($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		RETURNING id
		`,
		record.ParentID,
		record.Kind,
		record.Currency,
		record.Name,
		record.Description,
		record.Color,
		record.Icon,
		record.Capital,
		record.ArchivedAt,
		record.DeletedAt,
		record.CreatedAt,
		record.UpdatedAt,
	)

	return err
}

func findResponseDetailed(ctx context.Context, conn *sql.Conn, record account.Record) (responses.Detailed, error) {
	var (
		res     responses.Detailed
		histBlc nullable.Type[int64]
		histAt  nullable.Type[time.Time]
	)

	err := conn.QueryRowContext(
		ctx,
		`
	WITH
		active_transactions (
			id,
			source_id,
			target_id,
			issued_at,
			executed_at,
			source_amount,
			target_amount
		) AS (
			SELECT
				id,
				source_id,
				target_id,
				issued_at,
				executed_at,
				source_amount,
				target_amount
			FROM transactions
			WHERE
				deleted_at IS NULL
				AND (executed_at IS NULL OR executed_at <= NOW())
				AND issued_at <= NOW()
		),
		history_accounts (id, parent_id, balance, at) AS (
			SELECT
				acc.id,
				acc.parent_id,
				SUM(
					CASE
						WHEN tr.source_id = acc.id THEN - tr.source_amount
						ELSE tr.target_amount
					END
				) AS balance,
				MAX(tr.executed_at) AS at
			FROM
				accounts acc
				LEFT JOIN active_transactions tr ON tr.source_id = acc.id
				OR tr.target_id = acc.id
			WHERE
				acc.parent_id IS NOT NULL
				AND acc.deleted_at IS NULL
				AND acc.kind = $1
			GROUP BY
				acc.id
		)
	SELECT
		acc.id,
		acc.kind,
		acc.currency,
		acc.name,
		acc.description,
		SUM(
			COALESCE(
				CASE
					WHEN tr.source_id = acc.id THEN - tr.source_amount
					ELSE tr.target_amount
				END,
				0
			)
		) AS balance,
		acc.capital,
		MAX(hist.balance)::bigint AS hist_balance,
		MAX(hist.at)::date AS hist_at,
		acc.color,
		acc.icon,
		acc.archived_at,
		acc.created_at,
		acc.updated_at
	FROM
		accounts acc
		LEFT JOIN active_transactions tr ON tr.source_id = acc.id
		OR tr.target_id = acc.id
		LEFT JOIN history_accounts hist ON hist.parent_id = acc.id
	WHERE
		acc.deleted_at IS NULL
		AND acc.parent_id IS NULL
		AND acc.kind != $1
		AND acc.id = $2
	GROUP BY
		acc.id
		`,
		account.SystemHistoric,
		record.ID,
	).Scan(
		&res.ID,
		&res.Kind,
		&res.Currency,
		&res.Name,
		&res.Description,
		&res.Balance,
		&res.Capital,
		&histBlc,
		&histAt,
		&res.Color,
		&res.Icon,
		&res.ArchivedAt,
		&res.CreatedAt,
		&res.UpdatedAt,
	)
	if err != nil {
		return res, err
	}

	if histBlc.Valid && histAt.Valid {
		res.History = nullable.New(responses.History{
			Balance: histBlc.Val,
			At:      histAt.Val,
		})
	}

	return res, nil
}

package detailed_account_repository

import (
	"context"
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

func NewPostgreSQL(db databases.SQLAdapter) repositories.DetailedAccountRepository {
	return &repository{
		db: db,
	}
}

const (
	queryString = `
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
	`
)

func (r *repository) Find(ctx context.Context, id int64) (responses.Detailed, error) {
	var (
		res            responses.Detailed
		historyBalance nullable.Type[int64]
		historyAt      nullable.Type[time.Time]
	)

	conn, err := r.db.Conn(ctx)
	if err != nil {
		return res, err
	}
	defer conn.Close()

	query := queryString + `
	WHERE
		acc.deleted_at IS NULL
		AND acc.parent_id IS NULL
		AND acc.kind != $1
		AND acc.id = $2
	GROUP BY
		acc.id
	`

	err = conn.QueryRowContext(ctx, query, account.SystemHistoric, id).Scan(
		&res.ID,
		&res.Kind,
		&res.Currency,
		&res.Name,
		&res.Description,
		&res.Balance,
		&res.Capital,
		&historyBalance,
		&historyAt,
		&res.Color,
		&res.Icon,
		&res.ArchivedAt,
		&res.CreatedAt,
		&res.UpdatedAt,
	)
	if err != nil {
		return res, err
	}

	if historyBalance.Valid && historyAt.Valid {
		res.History = nullable.New(responses.History{
			Balance: historyBalance.Val,
			At:      historyAt.Val,
		})
	}

	return res, nil
}

func (r *repository) FindChildren(ctx context.Context, parentID int64) ([]responses.DetailedChild, error) {
	var (
		res = make([]responses.DetailedChild, 0, 10)
	)

	conn, err := r.db.Conn(ctx)
	if err != nil {
		return res, err
	}
	defer conn.Close()

	query := queryString + `
	WHERE
		acc.deleted_at IS NULL
		AND acc.parent_id IS NOT NULL
		AND acc.kind != $1
		AND acc.parent_id = $2
	GROUP BY
		acc.id
	ORDER BY
		acc.archived_at DESC NULLS FIRST, acc.created_at
	`

	rows, err := conn.QueryContext(ctx, query, account.SystemHistoric, parentID)
	if err != nil {
		return res, err
	}
	defer rows.Close()

	for rows.Next() {
		var (
			child          responses.DetailedChild
			historyBalance nullable.Type[int64]
			historyAt      nullable.Type[time.Time]
		)

		err = rows.Scan(
			&child.ID,
			&child.Kind,
			&child.Currency,
			&child.Name,
			&child.Description,
			&child.Balance,
			&child.Capital,
			&historyBalance,
			&historyAt,
			&child.Color,
			&child.Icon,
			&child.ArchivedAt,
			&child.CreatedAt,
			&child.UpdatedAt,
		)
		if err != nil {
			return res, err
		}

		if historyBalance.Valid && historyAt.Valid {
			child.History = nullable.New(responses.History{
				Balance: historyBalance.Val,
				At:      historyAt.Val,
			})
		}

		res = append(res, child)
	}

	return res, nil
}

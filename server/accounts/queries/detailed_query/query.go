package detailed_query

import (
	"context"
	"errors"
	"financo/server/accounts/types/response"
	"financo/server/services/postgres_database"
	"financo/server/types/generic/nullable"
	"financo/server/types/queries"
	"financo/server/types/records/account"
	"time"
)

type query struct {
	id int64
}

func New(id int64) queries.Query[response.Detailed] {
	return &query{
		id: id,
	}
}

func (q *query) Find(ctx context.Context) (response.Detailed, error) {
	var (
		res      response.Detailed
		histBlc  nullable.Type[int64]
		histAt   nullable.Type[time.Time]
		postgres = postgres_database.New()
	)

	conn, err := postgres.Conn(ctx)
	if err != nil {
		return res, errors.Join(errors.New("failed to get database connection"), err)
	}
	defer conn.Close()

	err = conn.QueryRowContext(
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
		q.id,
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
		res.History = nullable.New(response.History{
			Balance: histBlc.Val,
			At:      histAt.Val,
		})
	}

	return res, nil
}

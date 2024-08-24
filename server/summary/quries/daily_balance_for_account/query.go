package daily_balance_for_account

import (
	"context"
	"errors"
	"financo/server/summary/types/response"
	"financo/server/types/queries"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type query struct {
	conn      *pgxpool.Conn
	id        int64
	timestamp time.Time
}

func New(id int64, conn *pgxpool.Conn) queries.Query[[]response.Global] {
	return &query{
		conn:      conn,
		id:        id,
		timestamp: time.Now().UTC(),
	}
}

func (q *query) Find(ctx context.Context) ([]response.Global, error) {
	var (
		res = make([]response.Global, 0, 5)
	)

	// total amount per currency
	rows, err := q.conn.Query(
		ctx,
		`
			SELECT
				acc.currency,
				SUM(
					CASE
						WHEN tr.target_id = acc.id THEN tr.target_amount
						WHEN tr.source_id = acc.id THEN - tr.source_amount
						ELSE 0
					END
				)
			FROM transactions tr
				INNER JOIN accounts acc ON acc.id = tr.target_id OR acc.id = tr.source_id
			WHERE
				(acc.id = $1 OR acc.parent_id = $1)
				AND tr.deleted_at IS NULL
				AND acc.deleted_at IS NULL
				AND (tr.executed_at IS NULL OR tr.executed_at <= NOW())
				AND tr.issued_at <= NOW()
			GROUP BY
				acc.currency
		`,
		q.id,
	)
	if err != nil {
		return res, errors.Join(errors.New("failed to calculate balances"), err)
	}
	defer rows.Close()

	for rows.Next() {
		r := response.Global{Series: make([]response.SeriesEntry, 0, 31)}

		err = rows.Scan(&r.Currency, &r.Amount)
		if err != nil {
			return res, errors.Join(errors.New("failed to scan balances"), err)
		}

		res = append(res, r)
	}

	rows.Close()

	for i := 0; i < len(res); i++ {
		// total
		rows, err = q.conn.Query(
			ctx,
			`
				WITH RECURSIVE
					balance_day AS (
						SELECT NOW() as date
						UNION ALL
						SELECT date - INTERVAL '1' DAY
						FROM balance_day
						WHERE
							date > NOW() - INTERVAL '89' DAY
					)
				SELECT bd.date::DATE, SUM(COALESCE(blc.amount, 0))
				FROM balance_day bd
					LEFT JOIN (
						SELECT
							COALESCE(tr.executed_at, tr.issued_at) AS date,
							MAX(acc.currency) AS currency,
							SUM(
								CASE
									WHEN tr.target_id = acc.id THEN tr.target_amount
									WHEN tr.source_id = acc.id THEN - tr.source_amount
									ELSE 0
								END
							) AS amount
						FROM transactions tr
							INNER JOIN accounts acc ON acc.id = tr.target_id OR acc.id = tr.source_id
						WHERE
							(acc.id = $1 OR acc.parent_id = $1)
							AND tr.deleted_at IS NULL
							AND acc.deleted_at IS NULL
							AND (
								tr.executed_at IS NULL
								OR tr.executed_at BETWEEN (NOW() - INTERVAL '89' DAY)::DATE AND NOW())
							AND tr.issued_at BETWEEN (NOW() - INTERVAL '89' DAY)::DATE AND NOW()
						GROUP BY
							tr.executed_at, tr.issued_at, acc.currency
						ORDER BY acc.currency
					) AS blc ON blc.date = bd.date::DATE
				GROUP BY bd.date
				ORDER BY bd.date
			`,
			q.id,
		)
		if err != nil {
			return res, errors.Join(errors.New("failed to find series for currency"), err)
		}
		defer rows.Close()

		for rows.Next() {
			var r response.SeriesEntry

			err = rows.Scan(&r.Date, &r.Amount)
			if err != nil {
				return res, errors.Join(errors.New("failed to scan series entry for currency"), err)
			}

			res[i].Series = append(res[i].Series, r)
		}

		rows.Close()

		res[i].Amount = -res[i].Amount

		for j := 0; j < len(res[i].Series); j++ {
			res[i].Series[j].Amount = -res[i].Series[j].Amount
		}
	}

	return res, nil
}

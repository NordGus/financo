package summary_for_kind_query

import (
	"context"
	"errors"
	"financo/server/summary/types/response"
	"financo/server/types/queries"
	"financo/server/types/records/account"
	"financo/server/types/shared/currency"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type balance struct {
	currency currency.Type
	amount   int64
}

type query struct {
	conn      *pgxpool.Conn
	kinds     []account.Kind
	timestamp time.Time
}

func New(kinds []account.Kind, conn *pgxpool.Conn) queries.Query[[]response.Global] {
	return &query{
		conn:      conn,
		kinds:     kinds,
		timestamp: time.Now().UTC(),
	}
}

func (q *query) Find(ctx context.Context) ([]response.Global, error) {
	var (
		res = make([]response.Global, 0, 5)
	)

	// credits
	rows, err := q.conn.Query(
		ctx,
		`
			SELECT acc.currency, SUM(tr.target_amount)
			FROM transactions tr
				INNER JOIN accounts acc ON acc.id = tr.target_id
			WHERE
				acc.kind = ANY ($1)
				AND tr.deleted_at IS NULL
				AND acc.deleted_at IS NULL
				AND tr.executed_at IS NOT NULL
				AND tr.executed_at <= NOW()
			GROUP BY
				acc.currency
			ORDER BY acc.currency
		`,
		q.kinds,
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

	// debits
	rows, err = q.conn.Query(
		ctx,
		`
			SELECT acc.currency, SUM(tr.source_amount)
			FROM transactions tr
				INNER JOIN accounts acc ON acc.id = tr.source_id
			WHERE
				acc.kind = ANY ($1)
				AND tr.deleted_at IS NULL
				AND acc.deleted_at IS NULL
				AND tr.issued_at <= NOW()
			GROUP BY
				acc.currency
			ORDER BY acc.currency
		`,
		q.kinds,
	)
	if err != nil {
		return res, errors.Join(errors.New("failed to calculate balances"), err)
	}
	defer rows.Close()

	for rows.Next() {
		var (
			r     balance
			found = false
		)

		err = rows.Scan(&r.currency, &r.amount)
		if err != nil {
			return res, errors.Join(errors.New("failed to scan balances"), err)
		}

		for i := 0; i < len(res); i++ {
			if res[i].Currency == r.currency {
				res[i].Amount -= r.amount
				found = true
				break
			}
		}

		if found {
			continue
		}

		res = append(res, response.Global{
			Currency: r.currency,
			Amount:   -r.amount,
			Series:   make([]response.SeriesEntry, 0, 30),
		})
	}

	rows.Close()

	for i := 0; i < len(res); i++ {
		var (
			debits  = make([]response.SeriesEntry, 0, 30)
			credits = make([]response.SeriesEntry, 0, 30)
			blc     balance
		)

		// credits
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
							date > NOW() - INTERVAL '29' DAY
					)
				SELECT bd.date::DATE, SUM(COALESCE(blc.amount, 0))
				FROM balance_day bd
					LEFT JOIN (
						SELECT tr.executed_at AS date, acc.currency AS currency, SUM(tr.target_amount) AS amount
						FROM transactions tr
							INNER JOIN accounts acc ON acc.id = tr.target_id
						WHERE
							acc.kind = ANY ($1)
							AND acc.currency = $2
							AND tr.deleted_at IS NULL
							AND acc.deleted_at IS NULL
							AND tr.executed_at IS NOT NULL
							AND tr.executed_at BETWEEN (NOW() - INTERVAL '29' DAY)::DATE AND NOW()
						GROUP BY
							tr.executed_at, acc.currency
						ORDER BY acc.currency
					) AS blc ON blc.date = bd.date::DATE
				GROUP BY bd.date
				ORDER BY bd.date
			`,
			q.kinds,
			res[i].Currency,
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

			credits = append(credits, r)
		}

		rows.Close()

		// debits
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
							date > NOW() - INTERVAL '29' DAY
					)
				SELECT bd.date::DATE, SUM(COALESCE(blc.amount, 0))
				FROM balance_day bd
					LEFT JOIN (
						SELECT tr.issued_at AS date, acc.currency AS currency, SUM(tr.target_amount) AS amount
						FROM transactions tr
							INNER JOIN accounts acc ON acc.id = tr.source_id
						WHERE
							acc.kind = ANY ($1)
							AND acc.currency = $2
							AND tr.deleted_at IS NULL
							AND acc.deleted_at IS NULL
							AND tr.issued_at BETWEEN (NOW() - INTERVAL '29' DAY)::DATE AND NOW()
						GROUP BY
							tr.issued_at, acc.currency
						ORDER BY acc.currency
					) AS blc ON blc.date = bd.date::DATE
				GROUP BY bd.date
				ORDER BY bd.date
			`,
			q.kinds,
			res[i].Currency,
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

			debits = append(debits, r)
		}

		// balance credits
		rows, err := q.conn.Query(
			ctx,
			`
			SELECT acc.currency, SUM(tr.target_amount)
			FROM transactions tr
				INNER JOIN accounts acc ON acc.id = tr.target_id
			WHERE
				acc.kind = ANY ($1)
				AND acc.currency = $2
				AND tr.deleted_at IS NULL
				AND acc.deleted_at IS NULL
				AND tr.executed_at IS NOT NULL
				AND tr.executed_at <= (NOW() - INTERVAL '30' DAY)
			GROUP BY
				acc.currency
			ORDER BY acc.currency
		`,
			q.kinds,
			res[i].Currency,
		)
		if err != nil {
			return res, errors.Join(errors.New("failed to calculate balances"), err)
		}
		defer rows.Close()

		for rows.Next() {
			var r balance

			err = rows.Scan(&r.currency, &r.amount)
			if err != nil {
				return res, errors.Join(errors.New("failed to scan balances"), err)
			}

			blc.currency = r.currency
			blc.amount += r.amount
		}

		rows.Close()

		// balance debits
		rows, err = q.conn.Query(
			ctx,
			`
			SELECT acc.currency, SUM(tr.source_amount)
			FROM transactions tr
				INNER JOIN accounts acc ON acc.id = tr.source_id
			WHERE
				acc.kind = ANY ($1)
				AND acc.currency = $2
				AND tr.deleted_at IS NULL
				AND acc.deleted_at IS NULL
				AND tr.issued_at <= (NOW() - INTERVAL '30' DAY)
			GROUP BY
				acc.currency
			ORDER BY acc.currency
		`,
			q.kinds,
			res[i].Currency,
		)
		if err != nil {
			return res, errors.Join(errors.New("failed to calculate balances"), err)
		}
		defer rows.Close()

		for rows.Next() {
			var r balance

			err = rows.Scan(&r.currency, &r.amount)
			if err != nil {
				return res, errors.Join(errors.New("failed to scan balances"), err)
			}

			blc.currency = r.currency
			blc.amount -= r.amount
		}

		rows.Close()

		for j := 0; j < len(debits); j++ {
			if j == 0 {
				res[i].Series = append(res[i].Series, response.SeriesEntry{
					Date:   debits[j].Date,
					Amount: credits[j].Amount - debits[j].Amount + blc.amount,
				})
			} else {
				res[i].Series = append(res[i].Series, response.SeriesEntry{
					Date:   debits[j].Date,
					Amount: credits[j].Amount - debits[j].Amount + res[i].Series[j-1].Amount,
				})
			}
		}
	}

	return res, nil
}

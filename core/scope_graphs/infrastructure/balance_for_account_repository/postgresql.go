package balance_for_account_repository

import (
	"context"
	"database/sql"
	"financo/core/domain/databases"
	"financo/core/scope_graphs/domain/filters"
	"financo/core/scope_graphs/domain/repositories"
	"financo/core/scope_graphs/domain/responses"
	"financo/lib/currency"
	"time"
)

type postgresql struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.BalanceForAccount {
	return &postgresql{
		db: db,
	}
}

func (r *postgresql) Find(ctx context.Context, filter filters.BalanceForAccount) ([]responses.Summary, error) {
	var out []responses.Summary

	conn, err := r.db.Conn(ctx)
	if err != nil {
		return out, err
	}
	defer conn.Close()

	out, err = r.totalPerCurrency(ctx, conn, filter)
	if err != nil {
		return out, err
	}

	for i := 0; i < len(out); i++ {
		first, err := r.firstEntryForCurrency(ctx, conn, filter, out[i].Currency)
		if err != nil {
			return out, err
		}

		out[i].Series = append(out[i].Series, first)

		series, err := r.entriesForCurrency(ctx, conn, filter, out[i].Currency)
		if err != nil {
			return out, err
		}

		out[i].Series = append(out[i].Series, series...)

		for j := 1; j < len(out[i].Series); j++ {
			out[i].Series[j].Amount += out[i].Series[j-1].Amount
		}

		out[i].Series = r.deduplicateSeries(out[i].Series)
	}

	return out, nil
}

func (r *postgresql) totalPerCurrency(
	ctx context.Context, conn *sql.Conn, filter filters.BalanceForAccount,
) ([]responses.Summary, error) {
	var (
		query = `
		SELECT
			acc.currency,
			SUM(
				CASE
					WHEN tr.target_id = acc.id THEN tr.target_amount
					WHEN tr.source_id = acc.id THEN - tr.source_amount
					ELSE 0
				END
			)
		FROM
			transactions tr
			INNER JOIN accounts acc ON acc.id = tr.source_id OR acc.id = tr.target_id
		WHERE
			acc.id = $1
			AND tr.deleted_at IS NULL
			AND acc.deleted_at IS NULL
			AND (
				(tr.executed_at IS NULL AND tr.issued_at <= $2)
				OR
				(tr.executed_at IS NOT NULL AND tr.executed_at <= $2)
			)
		GROUP BY
			acc.currency
		ORDER BY acc.currency
		`

		id        = filter.ID
		to        = filter.ToValue()
		summaries = make([]responses.Summary, 0, 10)
	)

	rows, err := conn.QueryContext(ctx, query, id, to)
	if err != nil {
		return summaries, err
	}
	defer rows.Close()

	for rows.Next() {
		summary := responses.Summary{
			Series: make([]responses.SeriesEntry, 0, 31),
		}

		err = rows.Scan(&summary.Currency, &summary.Amount)
		if err != nil {
			return summaries, err
		}

		summaries = append(summaries, summary)
	}

	return summaries, nil
}

func (r *postgresql) firstEntryForCurrency(
	ctx context.Context, conn *sql.Conn, filter filters.BalanceForAccount, cur currency.Type,
) (responses.SeriesEntry, error) {
	var (
		query = `
		SELECT
			COALESCE(SUM(
				CASE
					WHEN tr.target_id = acc.id THEN tr.target_amount
					WHEN tr.source_id = acc.id THEN - tr.source_amount
					ELSE 0
				END
			), 0)
		FROM
			transactions tr
			INNER JOIN accounts acc ON acc.id = tr.source_id OR acc.id = tr.target_id
		WHERE
			acc.id = $1
			AND acc.currency = $2
			AND tr.deleted_at IS NULL
			AND acc.deleted_at IS NULL
			AND (
				(tr.executed_at IS NULL AND tr.issued_at <= $3)
				OR
				(tr.executed_at IS NOT NULL AND tr.executed_at <= $3)
			)
		`

		id   = filter.ID
		from = filter.FromValue()

		entry = responses.SeriesEntry{
			Date: time.Date(from.Year(), from.Month(), from.Day(), 0, 0, 0, 0, from.Location()),
		}
	)

	err := conn.QueryRowContext(ctx, query, id, cur, from).Scan(&entry.Amount)
	if err != nil {
		return entry, err
	}

	return entry, nil
}

func (r *postgresql) entriesForCurrency(
	ctx context.Context, conn *sql.Conn, filter filters.BalanceForAccount, cur currency.Type,
) ([]responses.SeriesEntry, error) {
	var (
		query = `
		WITH RECURSIVE
			balance_day AS (
				SELECT $2::timestamp as date
				UNION ALL
				SELECT date - INTERVAL '1' DAY
				FROM balance_day
				WHERE date > $1::timestamp + INTERVAL '1' DAY
			)
		SELECT bd.date::DATE, SUM(COALESCE(blc.amount, 0))
		FROM balance_day bd
			LEFT JOIN (
				SELECT
					COALESCE(tr.executed_at, tr.issued_at) AS date,
					SUM(
						CASE
							WHEN tr.target_id = acc.id THEN tr.target_amount
							WHEN tr.source_id = acc.id THEN - tr.source_amount
							ELSE 0
						END
					) AS amount
				FROM
					transactions tr
					INNER JOIN accounts acc ON acc.id = tr.target_id OR acc.id = tr.source_id
				WHERE
					acc.id = $3
					AND acc.currency = $4
					AND tr.deleted_at IS NULL
					AND acc.deleted_at IS NULL
					AND (
						tr.executed_at BETWEEN $1 AND $2
						OR
						tr.issued_at BETWEEN $1 AND $2
					)
				GROUP BY
					date
			) AS blc ON blc.date = bd.date::DATE
		GROUP BY bd.date
		ORDER BY bd.date
		`

		id   = filter.ID
		from = filter.FromValue().AddDate(0, 0, 1)
		to   = filter.ToValue()

		entries = make([]responses.SeriesEntry, 0, 30)
	)

	rows, err := conn.QueryContext(ctx, query, from, to, id, cur)
	if err != nil {
		return entries, err
	}
	defer rows.Close()

	for rows.Next() {
		var entry responses.SeriesEntry

		err = rows.Scan(&entry.Date, &entry.Amount)
		if err != nil {
			return entries, err
		}

		entries = append(entries, entry)
	}

	return entries, nil
}

func (r *postgresql) deduplicateSeries(series []responses.SeriesEntry) []responses.SeriesEntry {
	var (
		in  = make(map[time.Time]bool, len(series))
		out = make([]responses.SeriesEntry, 0, len(series))
	)

	for i := 0; i < len(series); i++ {
		if _, ok := in[series[i].Date]; !ok {
			in[series[i].Date] = true
			out = append(out, series[i])
		}
	}

	return out
}

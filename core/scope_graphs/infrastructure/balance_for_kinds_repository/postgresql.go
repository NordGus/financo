package balance_for_kinds_repository

import (
	"context"
	"database/sql"
	"financo/core/domain/databases"
	"financo/core/scope_graphs/domain/filters"
	"financo/core/scope_graphs/domain/repositories"
	"financo/core/scope_graphs/domain/responses"
	"financo/lib/currency"
)

type postgresql struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.BalanceForKinds {
	return &postgresql{
		db: db,
	}
}

func (r *postgresql) Find(ctx context.Context, filter filters.BalanceForKinds) ([]responses.Summary, error) {
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
	}

	return out, nil
}

func (r *postgresql) totalPerCurrency(
	ctx context.Context, conn *sql.Conn, filter filters.BalanceForKinds,
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
			acc.kind = ANY ($1)
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

		kinds     = filter.FilteredKinds()
		to        = filter.To.OrElse(filters.ToDefault())
		summaries = make([]responses.Summary, 0, 10)
	)

	rows, err := conn.QueryContext(ctx, query, kinds, to)
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
	ctx context.Context, conn *sql.Conn, filter filters.BalanceForKinds, cur currency.Type,
) (responses.SeriesEntry, error) {
	var (
		query = `
		SELECT
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
			acc.kind = ANY ($1)
			AND acc.currency = $2
			AND tr.deleted_at IS NULL
			AND acc.deleted_at IS NULL
			AND (
				(tr.executed_at IS NULL AND tr.issued_at <= $3)
				OR
				(tr.executed_at IS NOT NULL AND tr.executed_at <= $3)
			)
		`

		kinds = filter.FilteredKinds()
		from  = filter.To.OrElse(filters.FromDefault())

		entry = responses.SeriesEntry{Date: from}
	)

	err := conn.QueryRowContext(ctx, query, kinds, cur, from).Scan(&entry.Amount)
	if err != nil {
		return entry, err
	}

	return entry, nil
}

func (r *postgresql) entriesForCurrency(
	ctx context.Context, conn *sql.Conn, filter filters.BalanceForKinds, cur currency.Type,
) ([]responses.SeriesEntry, error) {
	var (
		query = `
		WITH RECURSIVE
			balance_day AS (
				SELECT $2::timestamp as date
				UNION ALL
				SELECT date - INTERVAL '1' DAY
				FROM balance_day
				WHERE date > $1
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
					INNER JOIN accounts acc ON acc.id = tr.target_id
					OR acc.id = tr.source_id
				WHERE
					acc.kind = ANY ($3)
					AND acc.currency = $4
					AND tr.deleted_at IS NULL
					AND acc.deleted_at IS NULL
					AND (
						(tr.executed_at IS NOT NULL AND tr.executed_at BETWEEN $1 AND $2)
						OR
						(tr.executed_at IS NULL AND tr.issued_at BETWEEN $1 AND $2)
					)
				GROUP BY
					date
			) AS blc ON blc.date = bd.date
		GROUP BY bd.date
		ORDER BY bd.date
		`

		kinds = filter.FilteredKinds()
		from  = filter.To.OrElse(filters.FromDefault()).AddDate(0, 1, 0)
		to    = filter.To.OrElse(filters.ToDefault())

		entries = make([]responses.SeriesEntry, 0, 30)
	)

	rows, err := conn.QueryContext(ctx, query, from, to, kinds, cur)
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

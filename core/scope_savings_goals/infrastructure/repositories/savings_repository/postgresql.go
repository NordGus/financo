package savings_repository

import (
	"context"
	"financo/core/domain/databases"
	"financo/core/scope_savings_goals/domain/filters"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/lib/currency"
	"financo/models/account"
	"time"
)

type postgresql struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.SavingsRepository {
	return &postgresql{db: db}
}

func (p *postgresql) Where(ctx context.Context, f filters.Savings) (map[currency.Type]int64, error) {
	out := make(map[currency.Type]int64, 10)

	conn, err := p.db.Conn(ctx)
	if err != nil {
		return out, err
	}
	defer conn.Close()

	rows, err := conn.QueryContext(
		ctx,
		`
		SELECT acc.currency, SUM(
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
			acc.currency = ANY($1)
			AND acc.kind = $2
			AND tr.deleted_at IS NULL
			AND acc.deleted_at IS NULL
			AND (tr.executed_at <= $3 OR tr.issued_at <= $3)
		GROUP BY
			acc.currency
		`,
		f.Currencies,
		account.CapitalSavings,
		time.Now().UTC(),
	)
	if err != nil {
		return out, err
	}

	for rows.Next() {
		var (
			curr    currency.Type
			savings int64
		)

		err = rows.Scan(&curr, &savings)
		if err != nil {
			_ = rows.Close()
			return out, err
		}

		out[curr] = savings
	}

	_ = rows.Close()

	return out, nil
}

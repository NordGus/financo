package savings_for_currency_repository

import (
	"context"
	"financo/core/domain/databases"
	"financo/core/scope_savings_goals/domain/models"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/lib/currency"
	"financo/models/account"
	"time"
)

type postgresql struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.SavingsForCurrency {
	return &postgresql{
		db: db,
	}
}

func (r *postgresql) Find(ctx context.Context, cur currency.Type) (models.SavingsForCurrency, error) {
	var out models.SavingsForCurrency

	conn, err := r.db.Conn(ctx)
	if err != nil {
		return out, err
	}
	defer conn.Close()

	err = conn.QueryRowContext(
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
			acc.currency = $1
			AND acc.kind = $2
			AND tr.deleted_at IS NULL
			AND acc.deleted_at IS NULL
			AND (tr.executed_at <= $3 OR tr.issued_at <= $3)
		GROUP BY
			acc.currency
		`,
		cur,
		account.CapitalSavings,
		time.Now().UTC(),
	).Scan(&out.Currency, &out.Savings)
	if err != nil {
		return out, err
	}

	return out, nil
}

package on_account_operated_repository

import (
	"context"
	"database/sql"
	"financo/core/domain/databases"
	"financo/core/scope_savings_goals/domain/models"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/lib/currency"
	"financo/models/account"
	"financo/models/achievement"
	"financo/models/achievement/savings_goal"
	"time"
)

type postgresql struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.OnAccountOperated {
	return &postgresql{
		db: db,
	}
}

func (r *postgresql) Find(ctx context.Context, cur currency.Type) (models.GoalsAndSavingsForCurrency, error) {
	out := models.GoalsAndSavingsForCurrency{
		Currency: cur,
		Savings:  0,
		Goals:    make([]savings_goal.Record, 0, 10),
	}

	conn, err := r.db.Conn(ctx)
	if err != nil {
		return out, err
	}
	defer conn.Close()

	out.Savings, err = r.findSavings(ctx, conn, cur)
	if err != nil {
		return out, err
	}

	out.Goals, err = r.findGoals(ctx, conn, cur)
	if err != nil {
		return out, err
	}

	return out, nil
}

func (r *postgresql) Save(ctx context.Context, records []savings_goal.Record) error {
	conn, err := r.db.Conn(ctx)
	if err != nil {
		return err
	}
	defer conn.Close()

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	for i := 0; i < len(records); i++ {
		record := records[i]

		err = tx.QueryRowContext(
			ctx,
			`
			UPDATE achievements
			SET settings = $2, updated_at = $3
			WHERE id = $1
			RETURNING updated_at
			`,
			record.ID,
			record.Settings,
			record.UpdatedAt,
		).Scan(&record.UpdatedAt)
		if err != nil {
			_ = tx.Rollback()
			return err
		}
	}

	err = tx.Commit()
	if err != nil {
		_ = tx.Rollback()
		return err
	}

	return nil
}

func (r *postgresql) findSavings(ctx context.Context, conn *sql.Conn, cur currency.Type) (int64, error) {
	var out int64

	rows, err := conn.QueryContext(
		ctx,
		`
		SELECT SUM(
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
	)
	if err != nil {
		return out, err
	}
	defer rows.Close()

	for rows.Next() {
		err = rows.Scan(&out)
		if err != nil {
			return out, err
		}
	}

	return out, nil
}

func (r *postgresql) findGoals(ctx context.Context, conn *sql.Conn, cur currency.Type) ([]savings_goal.Record, error) {
	out := make([]savings_goal.Record, 0, 10)

	rows, err := conn.QueryContext(
		ctx,
		`
		SELECT
			id,
			kind,
			name,
			description,
			settings,
			achieved_at,
			deleted_at,
			created_at,
			updated_at
		FROM achievements
		WHERE
			kind = $1
			AND settings->>'currency' = $2
			AND achieved_at IS NULL
			AND deleted_at IS NULL
		ORDER BY
			settings->'currency', settings->'position' ASC
		`,
		achievement.SavingsGoal,
		cur,
	)
	if err != nil {
		return out, err
	}
	defer rows.Close()

	for rows.Next() {
		var record savings_goal.Record

		err = rows.Scan(
			&record.ID,
			&record.Kind,
			&record.Name,
			&record.Description,
			&record.Settings,
			&record.AchievedAt,
			&record.DeletedAt,
			&record.CreatedAt,
			&record.UpdatedAt,
		)
		if err != nil {
			return out, err
		}

		out = append(out, record)
	}

	return out, nil
}

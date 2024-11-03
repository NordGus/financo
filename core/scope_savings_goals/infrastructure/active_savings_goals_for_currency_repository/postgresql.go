package active_savings_goals_for_currency_repository

import (
	"context"
	"financo/core/domain/databases"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/lib/currency"
	"financo/models/achievement"
	"financo/models/achievement/savings_goal"
)

type postgresql struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.ActiveSavingsGoalsForCurrency {
	return &postgresql{
		db: db,
	}
}

func (r *postgresql) Find(ctx context.Context, cur currency.Type) ([]savings_goal.Record, error) {
	out := make([]savings_goal.Record, 0, 10)

	conn, err := r.db.Conn(ctx)
	if err != nil {
		return out, err
	}
	defer conn.Close()

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

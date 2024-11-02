package active_savings_goals_repository

import (
	"context"
	"financo/core/domain/databases"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/core/scope_savings_goals/domain/responses"
	"financo/models/achievement"
	"financo/models/achievement/savings_goal"
)

type postgresql struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.ActiveSavingsGoals {
	return &postgresql{
		db: db,
	}
}

func (r *postgresql) Find(ctx context.Context) ([]responses.Active, error) {
	var (
		out = make([]responses.Active, 0, 10)
		idx = -1
	)

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
			AND achieved_at IS NULL
			AND deleted_at IS NULL
		ORDER BY
			settings->'currency', settings->'position' ASC
		`,
		achievement.SavingsGoal,
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

		if idx < 0 {
			out = append(out, r.buildResponse(record))
			idx = 0
		}

		if out[idx].Currency != record.Settings.Currency {
			out = append(out, r.buildResponse(record))
			idx++
		}

		out[idx].Goals = append(out[idx].Goals, record)
	}

	return out, nil
}

func (r *postgresql) buildResponse(record savings_goal.Record) responses.Active {
	return responses.Active{
		Currency: record.Settings.Currency,
		Goals:    make([]savings_goal.Record, 0, 10),
	}
}

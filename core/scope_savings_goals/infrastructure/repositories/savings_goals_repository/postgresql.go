package savings_goals_repository

import (
	"context"
	"financo/core/domain/databases"
	"financo/core/scope_savings_goals/domain/filters"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/models/achievement"
	"financo/models/achievement/savings_goal"
)

type Repository interface {
	repositories.SavingsGoalRepository
	repositories.SavingsGoalsRepository
}

type postgresql struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) Repository {
	return &postgresql{db: db}
}

func (p *postgresql) Find(ctx context.Context, id int64) (savings_goal.Record, error) {
	var record savings_goal.Record

	conn, err := p.db.Conn(ctx)
	if err != nil {
		return record, err
	}
	defer conn.Close()

	err = conn.QueryRowContext(
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
				id = $1
				AND achieved_at IS NULL
				AND deleted_at IS NULL
			`,
		id,
	).Scan(
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
		return record, err
	}

	return record, nil
}

func (p *postgresql) Where(ctx context.Context, f filters.SavingsGoals) ([]savings_goal.Record, error) {
	out := make([]savings_goal.Record, 0, 20)

	conn, err := p.db.Conn(ctx)
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
		f.Currency,
	)
	if err != nil {
		return out, err
	}

	for rows.Next() {
		var r savings_goal.Record

		err = rows.Scan(
			&r.ID,
			&r.Kind,
			&r.Name,
			&r.Description,
			&r.Settings,
			&r.AchievedAt,
			&r.DeletedAt,
			&r.CreatedAt,
			&r.UpdatedAt,
		)
		if err != nil {
			_ = rows.Close()
			return out, err
		}

		out = append(out, r)
	}

	_ = rows.Close()

	return out, nil
}

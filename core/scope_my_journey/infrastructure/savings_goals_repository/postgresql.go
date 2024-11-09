package savings_goals_repository

import (
	"context"
	"database/sql"
	"financo/core/domain/databases"
	"financo/core/scope_my_journey/domain/repositories"
	"financo/core/scope_my_journey/domain/responses"
	"financo/models/achievement"
	"financo/models/achievement/savings_goal"
)

type postgresql struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.SavingsGoals {
	return &postgresql{
		db: db,
	}
}

func (r *postgresql) Find(ctx context.Context) ([]responses.Milestone, error) {
	var out []responses.Milestone

	conn, err := r.db.Conn(ctx)
	if err != nil {
		return out, err
	}
	defer conn.Close()

	out, err = r.find(ctx, conn)
	if err != nil {
		return out, err
	}

	return out, nil
}

func (r *postgresql) find(ctx context.Context, conn *sql.Conn) ([]responses.Milestone, error) {
	var (
		out = make([]responses.Milestone, 0, 30)
		idx = -1
	)

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
			achieved_at IS NOT NULL
			AND deleted_at IS NULL
			AND kind = $1
		ORDER BY
			achieved_at DESC
		`,
		achievement.SavingsGoal,
	)
	if err != nil {
		return out, err
	}
	defer rows.Close()

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
			return out, err
		}

		if idx < 0 {
			out = append(out, responses.Milestone{
				Timestamp:    r.AchievedAtValue(),
				Achievements: make([]achievement.Milestone, 0, 10),
			})
			idx++
		}

		if !out[idx].Timestamp.Equal(r.AchievedAtValue()) {
			out = append(out, responses.Milestone{
				Timestamp:    r.AchievedAtValue(),
				Achievements: make([]achievement.Milestone, 0, 10),
			})
			idx++
		}

		out[idx].Achievements = append(out[idx].Achievements, r)
	}

	return out, nil
}

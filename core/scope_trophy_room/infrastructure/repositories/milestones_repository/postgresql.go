// Package milestones_repository implements the repository logic for
// interacting with the repository of all achievements.
package milestones_repository

import (
	"context"
	"database/sql"
	"financo/core/domain/databases"
	"financo/core/scope_trophy_room/domain/repositories"
	"financo/models/achievement"
	"financo/models/achievement/savings_goal"
	"slices"
)

type postgresql struct {
	db databases.SQLAdapter
}

const (
	minSliceSize = 50
)

func NewPostgreSQL(db databases.SQLAdapter) repositories.Milestones {
	return &postgresql{
		db: db,
	}
}

func (r *postgresql) Find(ctx context.Context) ([]achievement.Milestone, error) {
	var (
		out = make([]achievement.Milestone, 0, minSliceSize)
	)

	conn, err := r.db.Conn(ctx)
	if err != nil {
		return out, err
	}
	defer conn.Close()

	savings, err := r.findSavingsGoals(ctx, conn)
	if err != nil {
		return out, err
	}

	for _, goal := range savings {
		out = append(out, goal)
	}

	// sorting all results from newest to oldest
	slices.SortFunc(out, func(a achievement.Milestone, b achievement.Milestone) int {
		var (
			at = a.AchievedAtValue()
			bt = b.AchievedAtValue()
		)

		switch {
		case at.After(bt):
			return -1 // Newest first
		case at.Before(bt):
			return 1
		default:
			return 0
		}
	})

	return out, nil
}

func (r *postgresql) findSavingsGoals(ctx context.Context, conn *sql.Conn) ([]savings_goal.Record, error) {
	out := make([]savings_goal.Record, 0, minSliceSize)

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

		out = append(out, r)
	}

	return out, nil
}

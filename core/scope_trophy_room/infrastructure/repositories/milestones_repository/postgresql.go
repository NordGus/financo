// Package milestones_repository implements the repository logic for
// interacting with the repository of all achievements.
package milestones_repository

import (
	"context"
	"encoding/json"
	"errors"
	"financo/core/domain/databases"
	"financo/core/scope_trophy_room/domain/repositories"
	"financo/lib/nullable"
	"financo/models/achievement"
	"financo/models/achievement/savings_goal"
	"time"
)

type postgresql struct {
	db databases.SQLAdapter
}

type Repository interface {
	repositories.Milestones
}

const (
	minSliceCapacity       = 50
	settingsBufferCapacity = 1_024 * 1_024 // 1MB
)

func NewPostgreSQL(db databases.SQLAdapter) Repository {
	return &postgresql{
		db: db,
	}
}

func (r *postgresql) Find(ctx context.Context) ([]achievement.Milestone, error) {
	out := make([]achievement.Milestone, 0, minSliceCapacity)

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
			achieved_at IS NOT NULL
			AND deleted_at IS NULL
		ORDER BY
			achieved_at DESC,
			updated_at DESC
		`,
	)
	if err != nil {
		return out, err
	}
	defer rows.Close()

	for rows.Next() {
		var (
			id          int64
			kind        achievement.Kind
			name        string
			description nullable.Type[string]
			settings    = make([]uint8, 0, settingsBufferCapacity)
			achievedAt  nullable.Type[time.Time]
			deletedAt   nullable.Type[time.Time]
			createdAt   time.Time
			updatedAt   time.Time
		)

		err = rows.Scan(
			&id,
			&kind,
			&name,
			&description,
			&settings,
			&achievedAt,
			&deletedAt,
			&createdAt,
			&updatedAt,
		)
		if err != nil {
			return out, err
		}

		milestone, err := mapToMilestone(
			id,
			kind,
			name,
			description,
			settings,
			achievedAt,
			deletedAt,
			createdAt,
			updatedAt,
		)
		if err != nil {
			return out, errors.Join(
				errors.New("milestones_repository: failed to map row to milestone"),
				err,
			)
		}

		out = append(out, milestone)
	}

	return out, nil
}

func mapToMilestone(
	id int64,
	kind achievement.Kind,
	name string,
	description nullable.Type[string],
	settings []uint8,
	achievedAt nullable.Type[time.Time],
	deletedAt nullable.Type[time.Time],
	createdAt time.Time,
	updatedAt time.Time,
) (achievement.Milestone, error) {
	switch kind {
	case achievement.SavingsGoal:
		var s savings_goal.Settings

		err := json.Unmarshal(settings, &s)
		if err != nil {
			return nil, errors.Join(
				errors.New("milestones_repository: failed to unmarshal savings goal settings"),
				err,
			)
		}

		return savings_goal.Record{
			ID:          id,
			Kind:        kind,
			Name:        name,
			Description: description,
			Settings:    s,
			AchievedAt:  achievedAt,
			DeletedAt:   deletedAt,
			CreatedAt:   createdAt,
			UpdatedAt:   updatedAt,
		}, nil
	default:
		return nil, errors.New("milestones_repository: achievement kind not mapped")
	}
}

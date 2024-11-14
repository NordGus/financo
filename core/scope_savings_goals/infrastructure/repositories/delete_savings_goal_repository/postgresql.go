package delete_savings_goal_repository

import (
	"context"
	"financo/core/domain/databases"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/models/achievement/savings_goal"
)

type postgresql struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.DeleteSavingsGoal {
	return &postgresql{
		db: db,
	}
}

func (r *postgresql) Find(ctx context.Context, id int64) (savings_goal.Record, error) {
	var record savings_goal.Record

	conn, err := r.db.Conn(ctx)
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

func (r *postgresql) SoftDelete(ctx context.Context, record savings_goal.Record) error {
	conn, err := r.db.Conn(ctx)
	if err != nil {
		return err
	}
	defer conn.Close()

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	err = tx.QueryRowContext(
		ctx,
		`
		UPDATE achievements
		SET updated_at = $2, deleted_at = $3
		WHERE id = $1
		RETURNING updated_at, deleted_at
		`,
		record.ID,
		record.UpdatedAt,
		record.DeletedAt,
	).Scan(&record.UpdatedAt, &record.DeletedAt)
	if err != nil {
		_ = tx.Rollback()
		return err
	}

	err = tx.Commit()
	if err != nil {
		_ = tx.Rollback()
		return err
	}

	return nil
}

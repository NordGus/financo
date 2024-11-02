package reorder_repository

import (
	"context"
	"financo/core/domain/databases"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/models/achievement/savings_goal"
)

type postgresql struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.Reorder {
	return &postgresql{
		db: db,
	}
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
		record := records

		err = tx.QueryRowContext(
			ctx,
			`
			UPDATE achievements
			SET settings = $2, updated_at = $2
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

package create_repository

import (
	"context"
	"financo/core/domain/databases"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/models/achievement/savings_goal"
)

type postgresql struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.Create {
	return &postgresql{
		db: db,
	}
}

func (r *postgresql) Save(ctx context.Context, record savings_goal.Record) (savings_goal.Record, error) {
	conn, err := r.db.Conn(ctx)
	if err != nil {
		return record, err
	}
	defer conn.Close()

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return record, err
	}

	err = tx.QueryRowContext(
		ctx,
		`
		INSERT INTO
			achievements(
				kind,
				name,
				description,
				settings,
				achieved_at,
				deleted_at,
				created_at,
				updated_at
			)
		VALUES
			($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id
		`,
		record.Kind,
		record.Name,
		record.Description,
		record.Settings,
		record.AchievedAt,
		record.DeletedAt,
		record.CreatedAt,
		record.UpdatedAt,
	).Scan(&record.ID)
	if err != nil {
		_ = tx.Rollback()
		return record, err
	}

	err = tx.Commit()
	if err != nil {
		_ = tx.Rollback()
		return record, err
	}

	return record, nil
}

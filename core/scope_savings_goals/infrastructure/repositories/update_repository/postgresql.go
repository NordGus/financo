package update_repository

import (
	"context"
	"financo/core/domain/databases"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/models/achievement/savings_goal"
)

type postgresql struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.UpdateRepository {
	return &postgresql{
		db: db,
	}
}

func (p *postgresql) Save(ctx context.Context, r savings_goal.Record) error {
	conn, err := p.db.Conn(ctx)
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
		SET name = $2, description = $3, settings = $4, achieved_at = $5, deleted_at = $6, updated_at = $7
		WHERE id = $1
		RETURNING id
		`,
		r.ID,
		r.Name,
		r.Description,
		r.Settings,
		r.AchievedAt,
		r.DeletedAt,
		r.UpdatedAt,
	).Scan(&r.ID)
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

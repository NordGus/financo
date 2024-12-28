package update_dynamic_data_repository

import (
	"context"
	"database/sql"
	"financo/core/domain/databases"
	"financo/core/scope_categories/domain/models/category"
	"financo/core/scope_categories/domain/repositories"
	"financo/models/account"
)

type postgresql struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.UpdateDynamicDataRepository {
	return &postgresql{
		db: db,
	}
}

func (p *postgresql) Save(ctx context.Context, records []category.Record) error {
	conn, err := p.db.Conn(ctx)
	if err != nil {
		return err
	}
	defer conn.Close()

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	for i := 0; i < len(records); i++ {
		err = p.save(ctx, tx, records[i].Account)
		if err != nil {
			_ = tx.Rollback()
			return err
		}

		for j := 0; j < len(records[i].Children); j++ {
			err = p.save(ctx, tx, records[i].Children[j])
			if err != nil {
				_ = tx.Rollback()
				return err
			}
		}
	}

	err = tx.Commit()
	if err != nil {
		_ = tx.Rollback()
		return err
	}

	return nil
}

func (p *postgresql) save(ctx context.Context, tx *sql.Tx, r account.Record) error {
	err := tx.QueryRowContext(
		ctx,
		`
		UPDATE accounts
		SET dynamic_data = $2, updated_at = $3
		WHERE id = $1
		RETURNING id
		`,
		r.ID,
		r.DynamicData,
		r.UpdatedAt,
	).Scan(&r.ID)

	return err
}

package update_dynamic_data_repository

import (
	"context"
	"financo/core/domain/databases"
	"financo/core/scope_accounts/domain/repositories"
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

func (p *postgresql) Save(ctx context.Context, records []account.Record) error {
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
		err = tx.QueryRowContext(
			ctx,
			`
			UPDATE accounts
			SET dynamic_data = $2, updated_at = $3
			WHERE id = $1
			RETURNING id
			`,
			records[i].ID,
			records[i].DynamicData,
			records[i].UpdatedAt,
		).Scan(&records[i].ID)
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

package create_repository

import (
	"context"
	"database/sql"
	"financo/core/domain/databases"
	"financo/core/scope_categories/domain/models/category"
	"financo/core/scope_categories/domain/repositories"
	"financo/lib/nullable"
	"financo/models/account"
)

type postgresql struct {
	db databases.SQLAdapter
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.CreateRepository {
	return &postgresql{
		db: db,
	}
}

func (p *postgresql) Save(ctx context.Context, r account.Record, c []account.Record) (category.Record, error) {
	var out category.Record

	conn, err := p.db.Conn(ctx)
	if err != nil {
		return out, err
	}
	defer conn.Close()

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return out, err
	}

	r, err = p.persist(ctx, tx, r)
	if err != nil {
		_ = tx.Rollback()
		return out, err
	}

	for i := 0; i < len(c); i++ {
		child := c[i]
		child.ParentID = nullable.New(r.ID)

		c[i], err = p.persist(ctx, tx, child)
		if err != nil {
			_ = tx.Rollback()
			return out, err
		}
	}

	err = tx.Commit()
	if err != nil {
		_ = tx.Rollback()
		return out, err
	}

	return category.Record{
		Parent:   r,
		Children: c,
	}, nil
}

func (p *postgresql) persist(ctx context.Context, tx *sql.Tx, r account.Record) (account.Record, error) {
	err := tx.QueryRowContext(
		ctx,
		`
		INSERT INTO accounts(
			parent_id,
			kind,
			currency,
			name,
			description,
			color,
			icon,
			capital,
			dynamic_data,
			created_at,
			updated_at
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING id
		`,
		r.ParentID,
		r.Kind,
		r.Currency,
		r.Name,
		r.Description,
		r.Color,
		r.Icon,
		r.Capital,
		r.DynamicData,
		r.CreatedAt,
		r.UpdatedAt,
	).Scan(&r.ID)

	return r, err
}

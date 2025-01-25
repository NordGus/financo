package update_repository

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

func NewPostgreSQL(db databases.SQLAdapter) repositories.UpdateRepository {
	return &postgresql{
		db: db,
	}
}

func (p *postgresql) Find(ctx context.Context, id int64) (category.Record, error) {
	out := category.Record{Children: make([]account.Record, 0, 10)}

	conn, err := p.db.Conn(ctx)
	if err != nil {
		return out, err
	}
	defer conn.Close()

	rows, err := conn.QueryContext(
		ctx,
		`
		SELECT
			acc.id,
			acc.parent_id,
			acc.kind,
			acc.currency,
			acc.name,
			acc.description,
			acc.color,
			acc.icon,
			acc.capital,
			acc.archived_at,
			acc.deleted_at,
			acc.created_at,
			acc.updated_at,
			acc.dynamic_data,
			child.id,
			child.parent_id,
			child.kind,
			child.currency,
			child.name,
			child.description,
			child.color,
			child.icon,
			child.capital,
			child.archived_at,
			child.deleted_at,
			child.created_at,
			child.updated_at,
			child.dynamic_data
		FROM
			accounts acc
			LEFT JOIN accounts child ON child.parent_id = acc.id
			AND child.deleted_at IS NULL
		WHERE
			acc.deleted_at IS NULL
			AND acc.id = $1
			AND acc.kind = ANY($2)
		`,
		id,
		[]account.Kind{
			account.ExternalExpense,
			account.ExternalIncome,
		},
	)
	if err != nil {
		return out, err
	}

	for rows.Next() {
		var r postgresqlRow

		err = rows.Scan(
			&r.Parent.ID,
			&r.Parent.ParentID,
			&r.Parent.Kind,
			&r.Parent.Currency,
			&r.Parent.Name,
			&r.Parent.Description,
			&r.Parent.Color,
			&r.Parent.Icon,
			&r.Parent.Capital,
			&r.Parent.ArchivedAt,
			&r.Parent.DeletedAt,
			&r.Parent.CreatedAt,
			&r.Parent.UpdatedAt,
			&r.Parent.DynamicData,
			&r.ID,
			&r.ParentID,
			&r.Kind,
			&r.Currency,
			&r.Name,
			&r.Description,
			&r.Color,
			&r.Icon,
			&r.Capital,
			&r.ArchivedAt,
			&r.DeletedAt,
			&r.CreatedAt,
			&r.UpdatedAt,
			&r.DynamicData,
		)
		if err != nil {
			_ = rows.Close()
			return out, err
		}

		if out.Parent.ID != r.Parent.ID {
			out.Parent = r.Parent
		}

		if r.ID.Valid {
			out.Children = append(out.Children, account.Record{
				ID:          r.ID.Val,
				ParentID:    r.ParentID,
				Kind:        r.Kind.Val,
				Currency:    r.Currency.Val,
				Name:        r.Name.Val,
				Description: r.Description,
				Color:       r.Color.Val,
				Icon:        r.Icon.Val,
				Capital:     r.Capital.Val,
				ArchivedAt:  r.ArchivedAt,
				DeletedAt:   r.DeletedAt,
				CreatedAt:   r.CreatedAt.Val,
				UpdatedAt:   r.UpdatedAt.Val,
				DynamicData: r.DynamicData.Val,
			})
		}
	}

	_ = rows.Close()

	return out, nil
}

func (p *postgresql) Save(ctx context.Context, r category.Record) error {
	conn, err := p.db.Conn(ctx)
	if err != nil {
		return err
	}
	defer conn.Close()

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	err = p.save(ctx, tx, r.Parent)
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

func (p *postgresql) save(ctx context.Context, tx *sql.Tx, r account.Record) error {
	err := tx.QueryRowContext(
		ctx,
		`
		UPDATE accounts
		SET
			parent_id = $2, kind = $3, currency = $4, name = $5, description = $6, color = $7, icon = $8,
			capital = $9, archived_at = $10, deleted_at = $11, created_at = $12, updated_at = $13, dynamic_data = $14
		WHERE id = $1
		RETURNING id
		`,
		r.ID,
		r.ParentID,
		r.Kind,
		r.Currency,
		r.Name,
		r.Description,
		r.Color,
		r.Icon,
		r.Capital,
		r.ArchivedAt,
		r.DeletedAt,
		r.CreatedAt,
		r.UpdatedAt,
		r.DynamicData,
	).Scan(&r.ID)

	return err
}

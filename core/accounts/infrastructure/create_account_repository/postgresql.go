package create_account_repository

import (
	"context"
	"database/sql"
	"financo/core/accounts/domain/repositories"
	"financo/core/shared/domain/databases"
	"financo/server/types/generic/nullable"
	"financo/server/types/records/account"
	"time"
)

type repository struct {
	db        databases.SQLAdapter
	timestamp time.Time
}

func NewPostgreSQL(db databases.SQLAdapter) repositories.CreateAccountRepository {
	return &repository{
		db:        db,
		timestamp: time.Now().UTC(),
	}
}

func (r *repository) Save(ctx context.Context, args repositories.CreateAccountSaveArgs) (account.Record, error) {
	var (
		record = account.Record{
			Kind:        args.Record.Kind,
			Currency:    args.Record.Currency,
			Name:        args.Record.Name,
			Description: args.Record.Description,
			Color:       args.Record.Color,
			Capital:     args.Record.Capital,
			CreatedAt:   r.timestamp,
			UpdatedAt:   r.timestamp,
		}
	)

	conn, err := r.db.Conn(ctx)
	if err != nil {
		return record, err
	}
	defer conn.Close()

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return record, err
	}
	defer tx.Rollback()

	record, err = r.persist(ctx, tx, args.Record)
	if err != nil {
		return record, err
	}

	if args.History.Valid {
		history := account.Record{
			ParentID:    nullable.New(record.ID),
			Kind:        args.History.Val.Kind,
			Currency:    args.History.Val.Currency,
			Name:        args.History.Val.Name,
			Description: args.History.Val.Description,
			Color:       args.History.Val.Color,
			Capital:     args.History.Val.Capital,
			CreatedAt:   r.timestamp,
			UpdatedAt:   r.timestamp,
		}

		_, err := r.persist(ctx, tx, history)
		if err != nil {
			return record, err
		}
	}

	err = tx.Commit()
	if err != nil {
		return record, err
	}

	return record, nil
}

func (r *repository) persist(ctx context.Context, tx *sql.Tx, record account.Record) (account.Record, error) {
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
			created_at,
			updated_at
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id
		`,
		record.ParentID,
		record.Kind,
		record.Currency,
		record.Name,
		record.Description,
		record.Color,
		record.Icon,
		record.Capital,
		record.CreatedAt,
		record.UpdatedAt,
	).Scan(&record.ID)

	return record, err
}

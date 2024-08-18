package create_command

import (
	"context"
	"errors"
	"financo/server/transactions/queries/detailed_query"
	"financo/server/transactions/types/request"
	"financo/server/transactions/types/response"
	"financo/server/types/commands"
	"financo/server/types/generic/nullable"
	"financo/server/types/records/account"
	"financo/server/types/records/transaction"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type command struct {
	req       request.Create
	conn      *pgxpool.Conn
	timestamp time.Time
}

func New(conn *pgxpool.Conn, req request.Create) commands.Command[response.Detailed] {
	return &command{
		req:       req,
		conn:      conn,
		timestamp: time.Now().UTC(),
	}
}

func (c *command) Run(ctx context.Context) (response.Detailed, error) {
	var (
		record = transaction.Record{
			ID:           -1,
			SourceID:     c.req.SourceID,
			TargetID:     c.req.TargetID,
			SourceAmount: c.req.SourceAmount,
			TargetAmount: c.req.TargetAmount,
			Notes:        c.req.Notes,
			IssuedAt:     c.req.IssuedAt,
			ExecutedAt:   c.req.ExecutedAt,
			DeletedAt:    nullable.Type[time.Time]{},
			CreatedAt:    c.timestamp,
			UpdatedAt:    c.timestamp,
		}

		source account.Record
		target account.Record
		res    response.Detailed
	)

	if record.SourceID == record.TargetID {
		return res, errors.New("circular transaction")
	}

	source, err := c.findAccount(ctx, record.SourceID)
	if err != nil {
		return res, errors.Join(errors.New("transaction source not found"), err)
	}

	target, err = c.findAccount(ctx, record.TargetID)
	if err != nil {
		return res, errors.Join(errors.New("transaction target not found"), err)
	}

	if target.Currency == source.Currency {
		record.TargetAmount = record.SourceAmount
	}

	tx, err := c.conn.Begin(ctx)
	if err != nil {
		return res, errors.Join(errors.New("failed to begin database transaction"), err)
	}

	record, err = c.persistRecord(ctx, tx, record)
	if err != nil {
		tx.Rollback(ctx)
		return res, errors.Join(errors.New("failed to persist record"), err)
	}

	err = tx.Commit(ctx)
	if err != nil {
		return res, errors.Join(errors.New("failed to commit database transaction"), err)
	}

	res, err = detailed_query.New(record.ID, c.conn).Find(ctx)
	if err != nil {
		return res, errors.Join(errors.New("failed to find persisted account"), err)
	}

	return res, nil
}

func (c *command) findAccount(ctx context.Context, id int64) (account.Record, error) {
	var record account.Record

	err := c.conn.QueryRow(
		ctx,
		`
			SELECT
				id,
				parent_id,
				kind,
				currency,
				name,
				description,
				color,
				icon,
				capital,
				archived_at,
				deleted_at,
				created_at,
				updated_at
			FROM accounts
			WHERE deleted_at IS NULL
				AND id = $1
		`,
		id,
	).Scan(
		&record.ID,
		&record.ParentID,
		&record.Kind,
		&record.Currency,
		&record.Name,
		&record.Description,
		&record.Color,
		&record.Icon,
		&record.Capital,
		&record.ArchivedAt,
		&record.DeletedAt,
		&record.CreatedAt,
		&record.UpdatedAt,
	)

	return record, err
}

func (c *command) persistRecord(ctx context.Context, tx pgx.Tx, record transaction.Record) (transaction.Record, error) {
	err := tx.QueryRow(
		ctx,
		`
			INSERT INTO transactions(
				source_id,
				target_id,
				source_amount,
				target_amount,
				notes,
				issued_at,
				executed_at,
				created_at,
				updated_at
			) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
			RETURNING id
		`,
		record.SourceID,
		record.TargetID,
		record.SourceAmount,
		record.TargetAmount,
		record.Notes,
		record.IssuedAt,
		record.ExecutedAt,
		record.CreatedAt,
		record.UpdatedAt,
	).Scan(&record.ID)

	return record, err
}

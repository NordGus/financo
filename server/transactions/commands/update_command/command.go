package update_command

import (
	"context"
	"errors"
	"financo/server/transactions/queries/detailed_query"
	"financo/server/transactions/types/request"
	"financo/server/transactions/types/response"
	"financo/server/types/commands"
	"financo/server/types/records/account"
	"financo/server/types/records/transaction"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type command struct {
	req       request.Update
	conn      *pgxpool.Conn
	timestamp time.Time
}

func New(conn *pgxpool.Conn, req request.Update) commands.Command[response.Detailed] {
	return &command{
		req:       req,
		conn:      conn,
		timestamp: time.Now().UTC(),
	}
}

func (c *command) Run(ctx context.Context) (response.Detailed, error) {
	var res response.Detailed

	record, err := c.findTransaction(ctx)
	if err != nil {
		return res, errors.Join(errors.New("transaction not found"), err)
	}

	source, err := c.findAccount(ctx, c.req.SourceID)
	if err != nil {
		return res, errors.Join(errors.New("source account not found"), err)
	}

	target, err := c.findAccount(ctx, c.req.SourceID)
	if err != nil {
		return res, errors.Join(errors.New("target account not found"), err)
	}

	record.SourceID = c.req.SourceID
	record.TargetID = c.req.TargetID
	record.SourceAmount = c.req.SourceAmount
	record.TargetAmount = c.req.TargetAmount
	record.IssuedAt = c.req.IssuedAt
	record.ExecutedAt = c.req.ExecutedAt
	record.Notes = c.req.Notes
	record.UpdatedAt = c.timestamp

	if source.Currency == target.Currency {
		record.TargetAmount = record.SourceAmount
	}

	tx, err := c.conn.Begin(ctx)
	if err != nil {
		return res, errors.Join(errors.New("failed to begin transaction"), err)
	}

	err = c.persistRecord(ctx, tx, record)
	if err != nil {
		tx.Rollback(ctx)
		return res, errors.Join(errors.New("failed to persist record"), err)
	}

	err = tx.Commit(ctx)
	if err != nil {
		return res, errors.Join(errors.New("failed to commit transaction"), err)
	}

	res, err = detailed_query.New(record.ID, c.conn).Find(ctx)
	if err != nil {
		return res, errors.Join(errors.New("failed to retrieve response"), err)
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

func (c *command) findTransaction(ctx context.Context) (transaction.Record, error) {
	var record transaction.Record

	err := c.conn.QueryRow(
		ctx,
		`
			SELECT
				id,
				source_id,
				target_id,
				source_amount,
				target_amount,
				notes,
				issued_at,
				executed_at,
				deleted_at,
				created_at,
				updated_at
			FROM transactions
			WHERE deleted_at IS NULL
				AND id = $1
		`,
		c.req.ID,
	).Scan(
		&record.ID,
		&record.SourceID,
		&record.TargetID,
		&record.SourceAmount,
		&record.TargetAmount,
		&record.Notes,
		&record.IssuedAt,
		&record.ExecutedAt,
		&record.DeletedAt,
		&record.CreatedAt,
		&record.UpdatedAt,
	)

	return record, err
}

func (c *command) persistRecord(ctx context.Context, tx pgx.Tx, record transaction.Record) error {
	return tx.QueryRow(
		ctx,
		`
			UPDATE transactions SET
				source_id = $1,
				target_id = $2,
				source_amount = $3,
				target_amount = $4,
				notes = $5,
				issued_at = $6,
				executed_at = $7,
				updated_at = $8
			WHERE deleted_at IS NULL AND id = $9
			RETURNING id
		`,
		record.SourceID,
		record.TargetID,
		record.SourceAmount,
		record.TargetAmount,
		record.Notes,
		record.IssuedAt,
		record.ExecutedAt,
		record.UpdatedAt,
		record.ID,
	).Scan(&record.ID)
}

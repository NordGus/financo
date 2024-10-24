package update_command

import (
	"context"
	"database/sql"
	"errors"
	"financo/core/domain/commands"
	"financo/lib/nullable"
	"financo/models/account"
	"financo/models/transaction"
	"financo/server/transactions/brokers"
	"financo/server/transactions/queries/detailed_query"
	"financo/server/transactions/types/message"
	"financo/server/transactions/types/request"
	"financo/server/transactions/types/response"
	"financo/services/postgresql_database"
	"time"
)

type command struct {
	req       request.Update
	timestamp time.Time
}

func New(req request.Update) commands.Command[response.Detailed] {
	return &command{
		req:       req,
		timestamp: time.Now().UTC(),
	}
}

func (c *command) Run(ctx context.Context) (response.Detailed, error) {
	var (
		postgres = postgresql_database.New()
		broker   = brokers.New(nil)

		res response.Detailed
		msg message.Updated
	)

	conn, err := postgres.Conn(ctx)
	if err != nil {
		return res, errors.Join(errors.New("failed to retrieve database connection"), err)
	}
	defer conn.Close()

	record, err := c.findTransaction(ctx, conn)
	if err != nil {
		return res, errors.Join(errors.New("transaction not found"), err)
	}

	msg.PreviousState = record

	source, err := c.findAccount(ctx, conn, c.req.SourceID)
	if err != nil {
		return res, errors.Join(errors.New("source account not found"), err)
	}

	target, err := c.findAccount(ctx, conn, c.req.SourceID)
	if err != nil {
		return res, errors.Join(errors.New("target account not found"), err)
	}

	record.SourceID = c.req.SourceID
	record.TargetID = c.req.TargetID
	record.SourceAmount = c.req.SourceAmount
	record.TargetAmount = c.req.TargetAmount
	record.IssuedAt = c.req.IssuedAt.UTC()
	record.Notes = c.req.Notes
	record.UpdatedAt = c.timestamp

	if source.Currency == target.Currency {
		record.TargetAmount = record.SourceAmount
	}

	if c.req.ExecutedAt.Valid {
		record.ExecutedAt = nullable.New(c.req.ExecutedAt.Val.UTC())
	}

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return res, errors.Join(errors.New("failed to begin transaction"), err)
	}

	err = c.persistRecord(ctx, tx, record)
	if err != nil {
		return res, errors.Join(errors.New("failed to persist record"), err, tx.Rollback())
	}

	err = tx.Commit()
	if err != nil {
		return res, errors.Join(errors.New("failed to commit transaction"), err)
	}

	res, err = detailed_query.New(record.ID).Find(ctx)
	if err != nil {
		return res, errors.Join(errors.New("failed to retrieve response"), err)
	}

	msg.ID = record.ID
	msg.CurrentState = record

	return res, broker.PublishUpdated(msg)
}

func (c *command) findAccount(ctx context.Context, conn *sql.Conn, id int64) (account.Record, error) {
	var record account.Record

	err := conn.QueryRowContext(
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

func (c *command) findTransaction(ctx context.Context, conn *sql.Conn) (transaction.Record, error) {
	var record transaction.Record

	err := conn.QueryRowContext(
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

func (c *command) persistRecord(ctx context.Context, tx *sql.Tx, record transaction.Record) error {
	return tx.QueryRowContext(
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

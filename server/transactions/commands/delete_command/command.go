package delete_command

import (
	"context"
	"database/sql"
	"errors"
	"financo/server/services/postgres_database"
	"financo/server/transactions/brokers"
	"financo/server/transactions/queries/detailed_query"
	"financo/server/transactions/types/message"
	"financo/server/transactions/types/response"
	"financo/server/types/commands"
	"financo/server/types/generic/nullable"
	"financo/server/types/records/transaction"
	"time"
)

type command struct {
	id        int64
	timestamp time.Time
}

func New(id int64) commands.Command[response.Detailed] {
	return &command{
		id:        id,
		timestamp: time.Now().UTC(),
	}
}

func (c *command) Run(ctx context.Context) (response.Detailed, error) {
	var (
		findTransactionQuery = detailed_query.New(c.id)
		postgres             = postgres_database.New()
		broker               = brokers.New(nil)

		res response.Detailed
		msg message.Deleted
	)

	conn, err := postgres.Conn(ctx)
	if err != nil {
		return res, errors.Join(errors.New("failed to retrieve database connection"), err)
	}
	defer conn.Close()

	record, err := c.findTransaction(ctx, conn)
	if err != nil {
		return res, errors.Join(errors.New("failed to find record"), err)
	}

	msg.ID = record.ID
	msg.PreviousState = record

	record.UpdatedAt = c.timestamp
	record.DeletedAt = nullable.New(c.timestamp)

	msg.CurrentState = record

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return res, errors.Join(errors.New("failed to begin database transaction"), err)
	}

	res.UpdatedAt = c.timestamp

	err = c.markTransactionAsDeleted(ctx, tx)
	if err != nil {
		return res, errors.Join(errors.New("failed to mark transaction as deleted"), err, tx.Rollback())
	}

	err = tx.Commit()
	if err != nil {
		return res, errors.Join(errors.New("failed to commit transaction"), err)
	}

	res, err = findTransactionQuery.Find(ctx)
	if err != nil {
		return res, errors.Join(errors.New("failed to find transaction"), err)
	}

	return res, broker.PublishDeleted(msg)
}

func (c *command) markTransactionAsDeleted(ctx context.Context, tx *sql.Tx) error {
	_, err := tx.ExecContext(
		ctx,
		"UPDATE transactions SET deleted_at = $2, updated_at = $2 WHERE id = $1 AND deleted_at IS NULL",
		c.id,
		c.timestamp,
	)

	return err
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
		c.id,
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

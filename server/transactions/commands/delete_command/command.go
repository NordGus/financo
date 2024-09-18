package delete_command

import (
	"context"
	"database/sql"
	"errors"
	"financo/server/services/postgres_database"
	"financo/server/transactions/queries/detailed_query"
	"financo/server/transactions/types/response"
	"financo/server/types/commands"
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

		res response.Detailed
	)

	conn, err := postgres.Conn(ctx)
	if err != nil {
		return res, errors.Join(errors.New("failed to retrieve database connection"), err)
	}
	defer conn.Close()

	res, err = findTransactionQuery.Find(ctx)
	if err != nil {
		return res, errors.Join(errors.New("failed to find transaction"), err)
	}

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

	return res, nil
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

package delete_command

import (
	"context"
	"errors"
	"financo/server/transactions/queries/detailed_query"
	"financo/server/transactions/types/response"
	"financo/server/types/commands"
	"log"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type command struct {
	id        int64
	conn      *pgxpool.Conn
	timestamp time.Time
}

func New(conn *pgxpool.Conn, id int64) commands.Command[response.Detailed] {
	return &command{
		id:        id,
		conn:      conn,
		timestamp: time.Now().UTC(),
	}
}

func (c *command) Run(ctx context.Context) (response.Detailed, error) {
	findTransactionQuery := detailed_query.New(c.id, c.conn)

	res, err := findTransactionQuery.Find(ctx)
	if err != nil {
		return res, errors.Join(errors.New("failed to find transaction"), err)
	}

	tx, err := c.conn.Begin(ctx)
	if err != nil {
		return res, errors.Join(errors.New("failed to begin database transaction"), err)
	}
	defer func() {
		err := tx.Commit(ctx)
		if err != nil {
			log.Println("failed to commit transaction", err)
		}
	}()

	res.UpdatedAt = c.timestamp

	err = c.markTransactionAsDeleted(ctx, tx)
	if err != nil {
		tx.Rollback(ctx)
		return res, errors.Join(errors.New("failed to mark transaction as deleted"), err)
	}

	return res, nil
}

func (c *command) markTransactionAsDeleted(ctx context.Context, tx pgx.Tx) error {
	_, err := tx.Exec(
		ctx,
		"UPDATE transactions SET deleted_at = $2, updated_at = $2 WHERE id = $1 AND deleted_at IS NULL",
		c.id,
		c.timestamp,
	)

	return err
}

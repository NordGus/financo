package delete_command

import (
	"context"
	"financo/server/accounts/queries/detailed_children_query"
	"financo/server/accounts/queries/detailed_query"
	"financo/server/accounts/types/response"
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
	var (
		findAccountQuery  = detailed_query.New(c.id)
		findChildrenQuery = detailed_children_query.New(c.id)
		ids               = make([]int64, 0, 10)

		res response.Detailed
	)

	res, err := findAccountQuery.Find(ctx)
	if err != nil {
		return res, err
	}

	res.Children, err = findChildrenQuery.Find(ctx)
	if err != nil {
		return res, err
	}

	tx, err := c.conn.Begin(ctx)
	if err != nil {
		return res, err
	}
	defer func() {
		err := tx.Commit(ctx)
		if err != nil {
			log.Println("failed to commit transaction", err)
		}
	}()

	ids = append(ids, res.ID)
	res.UpdatedAt = c.timestamp

	for i := 0; i < len(res.Children); i++ {
		ids = append(ids, res.Children[i].ID)
		res.Children[i].UpdatedAt = c.timestamp
	}

	err = c.markAccountsAsDeleted(ctx, tx)
	if err != nil {
		tx.Rollback(ctx)
		return res, err
	}

	err = c.markTransactionsAsDeleted(ctx, tx, ids)
	if err != nil {
		tx.Rollback(ctx)
		return res, err
	}

	return res, nil
}

func (c *command) markAccountsAsDeleted(ctx context.Context, tx pgx.Tx) error {
	_, err := tx.Exec(
		ctx,
		`
			UPDATE accounts
			SET deleted_at = $2, updated_at = $2
			WHERE (id = $1 OR parent_id = $1) AND deleted_at IS NULL
		`,
		c.id,
		c.timestamp,
	)

	return err
}

func (c *command) markTransactionsAsDeleted(ctx context.Context, tx pgx.Tx, ids []int64) error {
	_, err := tx.Exec(
		ctx,
		`
			UPDATE transactions
			SET deleted_at = $2, updated_at = $2
			WHERE (source_id = ANY ($1) OR target_id = ANY ($1)) AND deleted_at IS NULL
		`,
		ids,
		c.timestamp,
	)

	return err
}

package delete_command

import (
	"context"
	"errors"
	"financo/server/accounts/queries/detailed_children_query"
	"financo/server/accounts/queries/detailed_query"
	"financo/server/accounts/types/response"
	"log"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Command interface {
	Run(context.Context) (response.Detailed, error)
}

type command struct {
	id        int64
	conn      *pgxpool.Conn
	timestamp time.Time
}

func New(conn *pgxpool.Conn, id int64) Command {
	return &command{
		id:        id,
		conn:      conn,
		timestamp: time.Now().UTC(),
	}
}

func (c *command) Run(ctx context.Context) (response.Detailed, error) {
	var (
		findAccountQuery  = detailed_query.New(c.id, c.conn)
		findChildrenQuery = detailed_children_query.New(c.id, c.conn)
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

	for i := 0; i < len(res.Children); i++ {
		ids = append(ids, res.Children[i].ID)
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
	return errors.New("not implemented")
}

func (c *command) markTransactionsAsDeleted(ctx context.Context, tx pgx.Tx, ids []int64) error {
	return errors.New("not implemented")
}

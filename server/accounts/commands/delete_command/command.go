package delete_command

import (
	"context"
	"database/sql"
	"errors"
	"financo/server/accounts/queries/detailed_children_query"
	"financo/server/accounts/queries/detailed_query"
	"financo/server/accounts/types/response"
	"financo/server/services/postgres_database"
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
		findAccountQuery  = detailed_query.New(c.id)
		findChildrenQuery = detailed_children_query.New(c.id)
		ids               = make([]int64, 0, 10)
		postgres          = postgres_database.New()

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

	conn, err := postgres.Conn(ctx)
	if err != nil {
		return res, errors.Join(errors.New("failed to retrieve database connection"), err)
	}
	defer conn.Close()

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return res, err
	}

	ids = append(ids, res.ID)
	res.UpdatedAt = c.timestamp

	for i := 0; i < len(res.Children); i++ {
		ids = append(ids, res.Children[i].ID)
		res.Children[i].UpdatedAt = c.timestamp
	}

	err = c.markAccountsAsDeleted(ctx, tx)
	if err != nil {
		return res, errors.Join(err, tx.Rollback())
	}

	err = c.markTransactionsAsDeleted(ctx, tx, ids)
	if err != nil {
		return res, errors.Join(err, tx.Rollback())
	}

	err = tx.Commit()
	if err != nil {
		return res, errors.Join(err, tx.Rollback())
	}

	return res, nil
}

func (c *command) markAccountsAsDeleted(ctx context.Context, tx *sql.Tx) error {
	_, err := tx.ExecContext(
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

func (c *command) markTransactionsAsDeleted(ctx context.Context, tx *sql.Tx, ids []int64) error {
	_, err := tx.ExecContext(
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

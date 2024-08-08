package update_command

import (
	"context"
	"errors"
	"financo/server/accounts/types/request"
	"financo/server/accounts/types/response"
	"financo/server/types/generic/nullable"
	"financo/server/types/records/account"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Command interface {
	Run(context.Context) (response.Detailed, error)
}

type command struct {
	req       request.Update
	conn      *pgxpool.Conn
	timestamp time.Time
}

func New(conn *pgxpool.Conn, req request.Update) Command {
	return &command{
		req:       req,
		conn:      conn,
		timestamp: time.Now().UTC(),
	}
}

func (c *command) Run(ctx context.Context) (response.Detailed, error) {
	records, err := c.findExistingRecordsAndBuildUpdate(ctx)
	if err != nil {
		return response.Detailed{}, err
	}

	tx, err := c.conn.Begin(ctx)
	if err != nil {
		return response.Detailed{}, err
	}
	defer func() {
		err := tx.Commit(ctx)
		if err != nil {
			log.Println("failed to commit transaction", err)
		}
	}()

	err = c.updateRecords(ctx, records, tx)
	if err != nil {
		tx.Rollback(ctx)
		return response.Detailed{}, err
	}

	if !account.IsExternal(c.req.Kind) {
		err = c.updateAccountHistory(ctx, tx)
		if err != nil {
			tx.Rollback(ctx)
			return response.Detailed{}, err
		}
	}

	return response.Detailed{}, nil
}

func (c *command) findExistingRecordsAndBuildUpdate(ctx context.Context) ([]account.Record, error) {
	var (
		records = make([]account.Record, 0, len(c.req.Children)+1)
		ids     = make([]int64, 0, len(c.req.Children)+1)
		i       = 0
	)

	ids = append(ids, c.req.ID)

	for i := 0; i < len(c.req.Children); i++ {
		if c.req.Children[i].ID.Valid {
			ids = append(ids, c.req.Children[i].ID.Val)
		}
	}

	rows, err := c.conn.Query(
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
	WHERE id = ANY ($1)
	ORDER BY parent_id NULLS FIRST
		`,
		ids,
	)
	defer rows.Close()
	if err != nil {
		return records, err
	}

	for rows.Next() {
		var record account.Record

		err = rows.Scan(
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
		if err != nil {
			return records, err
		}

		if i == 0 {
			record.Currency = c.req.Currency
			record.Name = c.req.Name
			record.Description = c.req.Description
			record.Color = c.req.Color
			record.Icon = c.req.Icon
			record.Capital = c.req.Capital
			record.UpdatedAt = c.timestamp

			if c.req.Archive {
				record.ArchivedAt = nullable.New(c.timestamp)
			}
		}

		if i > 0 {
			record.Currency = c.req.Children[i-1].Currency
			record.Name = c.req.Children[i-1].Name
			record.Description = c.req.Children[i-1].Description
			record.Color = c.req.Children[i-1].Color
			record.Icon = c.req.Children[i-1].Icon
			record.Capital = c.req.Children[i-1].Capital
			record.UpdatedAt = c.timestamp

			if c.req.Children[i-1].Archive {
				record.ArchivedAt = nullable.New(c.timestamp)
			}

			if c.req.Children[i-1].Delete {
				record.DeletedAt = nullable.New(c.timestamp)
			}
		}

		records = append(records, record)
		i++
	}

	return records, nil
}

func (c *command) updateRecords(ctx context.Context, records []account.Record, tx pgx.Tx) error {
	var (
		count       = len(records)
		values      = make([]any, 0, count*12)
		queryValues = make([]string, 0, count)
	)

	for i := 0; i < count; i++ {
		values = append(values,
			records[i].ID,
			records[i].ParentID,
			records[i].Kind,
			records[i].Currency,
			records[i].Name,
			records[i].Description,
			records[i].Color,
			records[i].Icon,
			records[i].Capital,
			records[i].ArchivedAt,
			records[i].DeletedAt,
			records[i].UpdatedAt,
		)

		queryValues = append(
			queryValues,
			fmt.Sprintf(
				"($%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d)",
				(i*count)+1,
				(i*count)+2,
				(i*count)+3,
				(i*count)+4,
				(i*count)+5,
				(i*count)+6,
				(i*count)+7,
				(i*count)+8,
				(i*count)+9,
				(i*count)+10,
				(i*count)+11,
				(i*count)+12,
			),
		)
	}

	query := fmt.Sprintf("UPDATE accounts acc SET acc.id = data.id, aac.parent_id = data.parent_id, acc.kind = data.kind, acc.currency = data.currency, acc.name = data.name, acc.description = data.description, acc.color = data.color, acc.icon = data.icon, acc.capital = data.capital, acc.archived_at = data.archived_at, acc.deleted_at = data.deleted_at, acc.updated_at = data.updated_at FROM (VALUES %s) AS data(id, parent_id, kind, currency, name, description, color, icon, capital, archived_at, deleted_at, updated_at) WHERE acc.id = data.id", strings.Join(queryValues, ", "))

	_, err := tx.Exec(ctx, query, values...)
	if err != nil {
		return err
	}

	return nil
}

func (c *command) updateAccountHistory(ctx context.Context, tx pgx.Tx) error {
	return errors.New("implement history update")
}

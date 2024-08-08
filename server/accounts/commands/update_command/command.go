package update_command

import (
	"context"
	"financo/server/accounts/types/request"
	"financo/server/accounts/types/response"
	"financo/server/types/generic/nullable"
	"financo/server/types/records/account"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Command interface {
	Run(context.Context) (response.Detailed, error)
}

type command struct {
	req  request.Update
	conn *pgxpool.Conn
}

func New(conn *pgxpool.Conn, req request.Update) Command {
	return &command{
		req:  req,
		conn: conn,
	}
}

func (c *command) Run(ctx context.Context) (response.Detailed, error) {
	records, err := c.findExistingRecordsAndBuildUpdate(ctx)
	if err != nil {
		return response.Detailed{}, err
	}

	return response.Detailed{}, nil
}

func (c *command) findExistingRecordsAndBuildUpdate(ctx context.Context) ([]account.Record, error) {
	var (
		records = make([]account.Record, 0, len(c.req.Children)+1)
		ids     = make([]int64, 0, len(c.req.Children)+1)
		i       = 0
		now     = time.Now()
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

		rows.Scan(
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

		if i == 0 {
			record.Currency = c.req.Currency
			record.Name = c.req.Name
			record.Description = c.req.Description
			record.Color = c.req.Color
			record.Icon = c.req.Icon
			record.Capital = c.req.Capital
			record.UpdatedAt = now

			if c.req.Archive {
				record.ArchivedAt = nullable.New(now)
			}
		}

		if i > 0 {
			record.Currency = c.req.Children[i-1].Currency
			record.Name = c.req.Children[i-1].Name
			record.Description = c.req.Children[i-1].Description
			record.Color = c.req.Children[i-1].Color
			record.Icon = c.req.Children[i-1].Icon
			record.Capital = c.req.Children[i-1].Capital
			record.UpdatedAt = now

			if c.req.Children[i-1].Archive {
				record.ArchivedAt = nullable.New(now)
			}

			if c.req.Children[i-1].Delete {
				record.DeletedAt = nullable.New(now)
			}
		}

		records = append(records, record)
		i++
	}

	return records, nil
}

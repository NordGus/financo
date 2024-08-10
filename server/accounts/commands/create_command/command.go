package create_command

import (
	"context"
	"financo/server/accounts/types/request"
	"financo/server/accounts/types/response"
	"financo/server/types/generic/nullable"
	"financo/server/types/records/account"
	"financo/server/types/shared/icon"
	"log"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Command interface {
	Run(context.Context) (response.Created, error)
}

type command struct {
	req       request.Create
	conn      *pgxpool.Conn
	timestamp time.Time
}

func New(conn *pgxpool.Conn, req request.Create) Command {
	return &command{
		req:       req,
		conn:      conn,
		timestamp: time.Now().UTC(),
	}
}

func (c *command) Run(ctx context.Context) (response.Created, error) {
	records, err := c.buildAccounts()
	if err != nil {
		return response.Created{}, err
	}

	return c.saveAccounts(ctx, records)
}

func (c *command) buildAccounts() ([2]account.Record, error) {
	var (
		records [2]account.Record

		record = account.Record{
			ID:          -1,
			Kind:        c.req.Kind,
			Currency:    c.req.Currency,
			Name:        c.req.Name,
			Description: c.req.Description,
			Color:       c.req.Color,
			Icon:        c.req.Icon,
			Capital:     0,
			CreatedAt:   c.timestamp,
			UpdatedAt:   c.timestamp,
		}
	)

	if account.IsDebt(c.req.Kind) {
		record.Capital = c.req.Capital
	}

	records[0] = record

	if !account.IsExternal(c.req.Kind) {
		records[1] = account.Record{
			ID:          -1,
			Kind:        account.SystemHistoric,
			Currency:    c.req.Currency,
			Name:        "History",
			Description: nullable.New("This is an automatically created account by the system to represent the lost balance history of the parent account. DO NOT MODIFY NOR DELETE"),
			Color:       "#8c8c8c",
			Icon:        icon.Base,
			Capital:     0,
			CreatedAt:   c.timestamp,
			UpdatedAt:   c.timestamp,
		}
	}

	return records, nil
}

func (c *command) saveAccounts(ctx context.Context, records [2]account.Record) (response.Created, error) {
	var (
		res response.Created

		parent  = records[0]
		history = records[1]
	)

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

	err = tx.QueryRow(
		ctx,
		`
			INSERT INTO accounts(
				kind,
				currency,
				name,
				description,
				color,
				icon,
				capital,
				created_at,
				updated_at
			)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
			RETURNING id
		`,
		parent.Kind,
		parent.Currency,
		parent.Name,
		parent.Description,
		parent.Color,
		parent.Icon,
		parent.Capital,
		parent.CreatedAt,
		parent.UpdatedAt,
	).Scan(&parent.ID)
	if err != nil {
		return res, err
	}

	if !account.IsExternal(c.req.Kind) {
		history.ParentID = nullable.New(parent.ID)

		err = tx.QueryRow(
			ctx,
			`
				INSERT INTO accounts(
					parent_id,
					kind,
					currency,
					name,
					description,
					color,
					icon,
					capital,
					created_at,
					updated_at
				)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
				RETURNING id
			`,
			history.ParentID,
			history.Kind,
			history.Currency,
			history.Name,
			history.Description,
			history.Color,
			history.Icon,
			history.Capital,
			history.CreatedAt,
			history.UpdatedAt,
		).Scan(&history.ID)
		if err != nil {
			return res, err
		}
	}

	res.ID = parent.ID
	res.Name = parent.Name

	return res, nil
}

package create_command

import (
	"context"
	"errors"
	"financo/server/accounts/types/request"
	"financo/server/accounts/types/response"
	"financo/server/services/postgres_database"
	"financo/server/types/commands"
	"financo/server/types/generic/nullable"
	"financo/server/types/records/account"
	"financo/server/types/shared/icon"
	"time"
)

type command struct {
	req       request.Create
	timestamp time.Time
}

func New(req request.Create) commands.Command[response.Created] {
	return &command{
		req:       req,
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
		parent   = records[0]
		history  = records[1]
		postgres = postgres_database.New()

		res response.Created
	)

	conn, err := postgres.Conn(ctx)
	if err != nil {
		return res, errors.Join(errors.New("failed to acquire database connection"), err)
	}
	defer conn.Close()

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return res, err
	}

	err = tx.QueryRowContext(
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
		return res, errors.Join(err, tx.Rollback())
	}

	if !account.IsExternal(c.req.Kind) {
		history.ParentID = nullable.New(parent.ID)

		err = tx.QueryRowContext(
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
			return res, errors.Join(err, tx.Rollback())
		}
	}

	res.ID = parent.ID
	res.Name = parent.Name

	err = tx.Commit()
	if err != nil {
		return res, errors.Join(err, tx.Rollback())
	}

	return res, nil
}

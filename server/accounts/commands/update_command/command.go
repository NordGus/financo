package update_command

import (
	"context"
	"financo/server/accounts/types/request"
	"financo/server/accounts/types/response"
	"financo/server/types/generic/nullable"
	"financo/server/types/records/account"
	"financo/server/types/records/transaction"
	"fmt"
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

	tx.Commit(ctx)

	return c.buildResponse(ctx)
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
	if err != nil {
		return records, err
	}
	defer rows.Close()

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

	query := fmt.Sprintf("UPDATE accounts acc SET acc.kind = data.kind, acc.currency = data.currency, acc.name = data.name, acc.description = data.description, acc.color = data.color, acc.icon = data.icon, acc.capital = data.capital, acc.archived_at = data.archived_at, acc.deleted_at = data.deleted_at, acc.updated_at = data.updated_at FROM (VALUES %s) AS data(id, parent_id, kind, currency, name, description, color, icon, capital, archived_at, deleted_at, updated_at) WHERE acc.id = data.id", strings.Join(queryValues, ", "))

	_, err := tx.Exec(ctx, query, values...)
	if err != nil {
		return err
	}

	return nil
}

func (c *command) updateAccountHistory(ctx context.Context, tx pgx.Tx) error {
	h, err := c.findHistoryAccount(ctx)
	if err != nil {
		return err
	}

	t, err := c.findOrInitializeHistoryTransaction(ctx, h)
	if err != nil {
		return err
	}

	return c.updateHistoryTransaction(ctx, tx, h, t)
}

func (c *command) findHistoryAccount(ctx context.Context) (account.Record, error) {
	var (
		query = `
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
	WHERE parent_id = $1
		AND kind = $2
		`

		record account.Record
	)

	err := c.conn.QueryRow(ctx, query, c.req.ID, account.SystemHistoric).Scan(
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

	record.Currency = c.req.Currency
	record.UpdatedAt = c.timestamp

	return record, err
}

func (c *command) findOrInitializeHistoryTransaction(ctx context.Context, history account.Record) (transaction.Record, error) {
	var (
		present = false
		record  = transaction.Record{
			ID:         -1,
			SourceID:   history.ID,
			TargetID:   c.req.ID,
			Notes:      nullable.New("This transaction was created automatically by the system. DO NOT MODIFY"),
			IssuedAt:   c.timestamp,
			ExecutedAt: nullable.New(c.timestamp),
			DeletedAt:  nullable.New(c.timestamp),
			CreatedAt:  c.timestamp,
			UpdatedAt:  c.timestamp,
		}
	)

	err := c.conn.QueryRow(
		ctx,
		`
	SELECT
		id != NULL
	FROM transactions
	WHERE (source_id = $1 AND target_id = $2)
		OR (source_id = $2 AND target_id = $1)
		`,
		c.req.ID,
		history.ID,
	).Scan(&present)
	if err != nil {
		return record, err
	}

	if present {
		err = c.conn.QueryRow(
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
	WHERE (source_id = $1 AND target_id = $2)
		OR (source_id = $2 AND target_id = $1)
			`,
			c.req.ID,
			history.ID,
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
	}

	return record, err
}

func (c *command) updateHistoryTransaction(ctx context.Context, tx pgx.Tx, hist account.Record, tr transaction.Record) error {
	if !c.req.History.Present {
		tr.DeletedAt = nullable.New(c.timestamp)
	}

	if c.req.History.Present {
		tr.IssuedAt = c.req.History.At.Val
		tr.ExecutedAt = c.req.History.At
		tr.DeletedAt = nullable.Type[time.Time]{}
	}

	if c.req.History.Present && c.req.History.Balance.Present && c.req.History.Balance.Val >= 0 {
		tr.SourceID = hist.ID
		tr.TargetID = c.req.ID
		tr.SourceAmount = c.req.History.Balance.Val
		tr.TargetAmount = c.req.History.Balance.Val
	}

	if c.req.History.Present && c.req.History.Balance.Present && c.req.History.Balance.Val < 0 {
		tr.SourceID = c.req.ID
		tr.TargetID = hist.ID
		tr.SourceAmount = -c.req.History.Balance.Val
		tr.TargetAmount = -c.req.History.Balance.Val
	}

	tr.UpdatedAt = c.timestamp

	if tr.ID > 1 {
		_, err := tx.Exec(
			ctx,
			`
	UPDATE transactions
	SET
		source_id = $2,
		target_id = $3,
		source_amount = $4,
		target_amount = $5,
		notes = $6,
		issued_at = $7,
		executed_at = $8,
		deleted_at = $9,
		updated_at = $10
	WHERE id = $1
			`,
			tr.ID,
			tr.SourceID,
			tr.TargetID,
			tr.SourceAmount,
			tr.TargetAmount,
			tr.Notes,
			tr.IssuedAt,
			tr.ExecutedAt,
			tr.DeletedAt,
			tr.UpdatedAt,
		)
		if err != nil {
			return err
		}
	}

	if tr.ID <= 0 {
		_, err := tx.Exec(
			ctx,
			`
	INSERT INTO transactions (
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
	) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
			`,
			tr.SourceID,
			tr.TargetID,
			tr.SourceAmount,
			tr.TargetAmount,
			tr.Notes,
			tr.IssuedAt,
			tr.ExecutedAt,
			tr.DeletedAt,
			tr.CreatedAt,
			tr.UpdatedAt,
		)
		if err != nil {
			return err
		}
	}

	_, err := tx.Exec(
		ctx,
		"UPDATE accounts SET currency = $2, updated_at = $3 WHERE id = $1",
		hist.ID,
		hist.Currency,
		hist.UpdatedAt,
	)

	return err
}

func (c *command) buildResponse(ctx context.Context) (response.Detailed, error) {
	return response.Detailed{}, nil
}

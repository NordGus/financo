package update_command

import (
	"context"
	"errors"
	"financo/server/accounts/types/request"
	"financo/server/accounts/types/response"
	"financo/server/types/generic/nullable"
	"financo/server/types/records/account"
	"financo/server/types/records/transaction"
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
	records, err := c.findOrInitializeRecords(ctx)
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

func (c *command) findOrInitializeRecords(ctx context.Context) ([]account.Record, error) {
	var (
		records    = make([]account.Record, 0, len(c.req.Children)+1)
		indexes    = make([]int, 0, len(c.req.Children))
		newRecords = make([]account.Record, 0, len(c.req.Children))
		ids        = make([]int64, 0, len(c.req.Children)+1)
		i          = 0
	)

	ids = append(ids, c.req.ID)

	for i := 0; i < len(c.req.Children); i++ {
		if c.req.Children[i].ID.Valid {
			ids = append(ids, c.req.Children[i].ID.Val)
			indexes = append(indexes, i)
		} else {
			record := account.Record{
				ID:          -1,
				ParentID:    nullable.New(c.req.ID),
				Kind:        c.req.Children[i].Kind,
				Currency:    c.req.Children[i].Currency,
				Name:        c.req.Children[i].Name,
				Description: c.req.Children[i].Description,
				Color:       c.req.Children[i].Color,
				Icon:        c.req.Children[i].Icon,
				Capital:     c.req.Children[i].Capital,
				CreatedAt:   c.timestamp,
				UpdatedAt:   c.timestamp,
			}

			if c.req.Children[i].Archive {
				record.ArchivedAt = nullable.New(c.timestamp)
			}

			if c.req.Children[i].Delete {
				record.DeletedAt = nullable.New(c.timestamp)
			}

			newRecords = append(newRecords, record)
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
		AND deleted_at IS NULL
		AND kind != $2
	ORDER BY parent_id NULLS FIRST
		`,
		ids,
		account.SystemHistoric,
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
			record.Currency = c.req.Children[indexes[i-1]].Currency
			record.Name = c.req.Children[indexes[i-1]].Name
			record.Description = c.req.Children[indexes[i-1]].Description
			record.Color = c.req.Children[indexes[i-1]].Color
			record.Icon = c.req.Children[indexes[i-1]].Icon
			record.Capital = c.req.Children[indexes[i-1]].Capital
			record.UpdatedAt = c.timestamp

			if c.req.Children[indexes[i-1]].Archive {
				record.ArchivedAt = nullable.New(c.timestamp)
			}

			if c.req.Children[indexes[i-1]].Delete {
				record.DeletedAt = nullable.New(c.timestamp)
			}
		}

		records = append(records, record)
		i++
	}

	records = append(records, newRecords...)

	if len(records) == 0 {
		return records, errors.New("account not found")
	}

	return records, nil
}

func (c *command) updateRecords(ctx context.Context, records []account.Record, tx pgx.Tx) error {
	for i := 0; i < len(records); i++ {
		record := records[i]

		if record.ID > 0 {
			_, err := tx.Exec(
				ctx,
				`
					UPDATE accounts
					SET
						kind = $2,
						currency = $3,
						name = $4,
						description = $5,
						color = $6,
						icon = $7,
						capital = $8,
						archived_at = $9,
						deleted_at = $10,
						updated_at = $11
					WHERE accounts.id = $1
				 `,
				record.ID,
				record.Kind,
				record.Currency,
				record.Name,
				record.Description,
				record.Color,
				record.Icon,
				record.Capital,
				record.ArchivedAt,
				record.DeletedAt,
				record.UpdatedAt,
			)
			if err != nil {
				return err
			}
		}

		if record.ID <= 0 {
			var id int64

			err := tx.QueryRow(
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
						archived_at,
						deleted_at,
						created_at,
						updated_at
					) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
					RETURNING id
				 `,
				record.ParentID,
				record.Kind,
				record.Currency,
				record.Name,
				record.Description,
				record.Color,
				record.Icon,
				record.Capital,
				record.ArchivedAt,
				record.DeletedAt,
				record.CreatedAt,
				record.UpdatedAt,
			).Scan(&id)
			if err != nil {
				return err
			}
		}
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
		COUNT(id) > 0
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

		if c.req.History.Balance.Present && c.req.History.Balance.Val > 0 {
			tr.SourceID = hist.ID
			tr.TargetID = c.req.ID
			tr.SourceAmount = c.req.History.Balance.Val
			tr.TargetAmount = c.req.History.Balance.Val
		}

		if c.req.History.Balance.Present && c.req.History.Balance.Val < 0 {
			tr.SourceID = c.req.ID
			tr.TargetID = hist.ID
			tr.SourceAmount = -c.req.History.Balance.Val
			tr.TargetAmount = -c.req.History.Balance.Val
		}
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
	var (
		res = response.Detailed{
			ID:          c.req.ID,
			Kind:        c.req.Kind,
			Currency:    c.req.Currency,
			Name:        c.req.Name,
			Description: c.req.Description,
			Balance:     0,
			Capital:     c.req.Capital,
			Color:       string(c.req.Color),
			Icon:        c.req.Icon,
			ArchivedAt:  nullable.Type[time.Time]{},
			CreatedAt:   c.timestamp,
			UpdatedAt:   c.timestamp,
			Children:    make([]response.DetailedChild, 0, 10),
		}

		histBalance nullable.Type[int64]
		histAt      nullable.Type[time.Time]
	)

	err := c.conn.QueryRow(
		ctx,
		`
			WITH
				active_transactions (
					id,
					source_id,
					target_id,
					issued_at,
					executed_at,
					source_amount,
					target_amount
				) AS (
					SELECT
						id,
						source_id,
						target_id,
						issued_at,
						executed_at,
						source_amount,
						target_amount
					FROM transactions
					WHERE
						deleted_at IS NULL
						AND executed_at IS NOT NULL
						AND executed_at <= NOW()
				),
				history_accounts (id, parent_id, balance, at) AS (
					SELECT
						acc.id,
						acc.parent_id,
						SUM(
							CASE
								WHEN tr.source_id = acc.id THEN - tr.source_amount
								ELSE tr.target_amount
							END
						) AS balance,
						MAX(tr.executed_at) AS at
					FROM
						accounts acc
						LEFT JOIN active_transactions tr ON tr.source_id = acc.id
						OR tr.target_id = acc.id
					WHERE
						acc.parent_id IS NOT NULL
						AND acc.deleted_at IS NULL
						AND acc.kind = $1
					GROUP BY
						acc.id
				)
			SELECT
				acc.id,
				SUM(
					COALESCE(
						CASE
							WHEN tr.source_id = acc.id THEN - tr.source_amount
							ELSE tr.target_amount
						END,
						0
					)
				) AS balance,
				MAX(hist.balance)::bigint AS hist_balance,
				MAX(hist.at)::date AS hist_at,
				acc.archived_at,
				acc.created_at,
				acc.updated_at
			FROM
				accounts acc
				LEFT JOIN active_transactions tr ON tr.source_id = acc.id
				OR tr.target_id = acc.id
				LEFT JOIN history_accounts hist ON hist.parent_id = acc.id
			WHERE
				acc.deleted_at IS NULL
				AND acc.id = $2
			GROUP BY
				acc.id
		`,
		account.SystemHistoric,
		res.ID,
	).Scan(
		&res.ID,
		&res.Balance,
		&histBalance,
		&histAt,
		&res.ArchivedAt,
		&res.CreatedAt,
		&res.UpdatedAt,
	)
	if err != nil {
		return res, err
	}

	if c.req.History.Present && histBalance.Valid && histAt.Valid {
		res.History = nullable.New(response.History{
			Balance: histBalance.Val,
			At:      histAt.Val,
		})
	}

	rows, err := c.conn.Query(
		ctx,
		`
			WITH
				active_transactions (
					id,
					source_id,
					target_id,
					issued_at,
					executed_at,
					source_amount,
					target_amount
				) AS (
					SELECT
						id,
						source_id,
						target_id,
						issued_at,
						executed_at,
						source_amount,
						target_amount
					FROM transactions
					WHERE
						deleted_at IS NULL
						AND executed_at IS NOT NULL
						AND executed_at <= NOW()
				),
				history_accounts (id, parent_id, balance, at) AS (
					SELECT
						acc.id,
						acc.parent_id,
						SUM(
							CASE
								WHEN tr.source_id = acc.id THEN - tr.source_amount
								ELSE tr.target_amount
							END
						) AS balance,
						MAX(tr.executed_at) AS at
					FROM
						accounts acc
						LEFT JOIN active_transactions tr ON tr.source_id = acc.id
						OR tr.target_id = acc.id
					WHERE
						acc.parent_id IS NOT NULL
						AND acc.deleted_at IS NULL
						AND acc.kind = $1
					GROUP BY
						acc.id
				)
			SELECT
				acc.id,
				acc.kind,
				acc.currency,
				acc.name,
				acc.description,
				SUM(
					COALESCE(
						CASE
							WHEN tr.source_id = acc.id THEN - tr.source_amount
							ELSE tr.target_amount
						END,
						0
					)
				) AS balance,
				acc.capital,
				MAX(COALESCE(hist.balance, 0))::bigint AS hist_balance,
				MAX(hist.at)::date AS hist_at,
				acc.color,
				acc.icon,
				acc.archived_at,
				acc.created_at,
				acc.updated_at
			FROM
				accounts acc
				LEFT JOIN active_transactions tr ON tr.source_id = acc.id
				OR tr.target_id = acc.id
				LEFT JOIN history_accounts hist ON hist.parent_id = acc.id
			WHERE
				acc.deleted_at IS NULL
				AND acc.kind != $1
				AND acc.parent_id = $2
			GROUP BY
				acc.id
			ORDER BY acc.archived_at DESC NULLS FIRST, acc.created_at
		`,
		account.SystemHistoric,
		res.ID,
	)
	if err != nil {
		return res, err
	}
	defer rows.Close()

	for rows.Next() {
		var child response.DetailedChild

		err = rows.Scan(
			&child.ID,
			&child.Kind,
			&child.Currency,
			&child.Name,
			&child.Description,
			&child.Balance,
			&child.Capital,
			&histBalance,
			&histAt,
			&child.Color,
			&child.Icon,
			&child.ArchivedAt,
			&child.CreatedAt,
			&child.UpdatedAt,
		)
		if err != nil {
			return res, err
		}

		if histBalance.Valid && histAt.Valid {
			child.History = nullable.New(response.History{
				Balance: histBalance.Val,
				At:      histAt.Val,
			})
		}

		res.Balance += child.Balance
		res.Children = append(res.Children, child)
	}

	return res, nil
}

package create_command

import (
	"context"
	"database/sql"
	"errors"
	"financo/core/domain/commands"
	"financo/lib/nullable"
	"financo/models/account"
	"financo/models/transaction"
	"financo/server/transactions/brokers"
	"financo/server/transactions/queries/detailed_query"
	"financo/server/transactions/types/message"
	"financo/server/transactions/types/request"
	"financo/server/transactions/types/response"
	"financo/services/postgresql_database"
	"time"
)

type command struct {
	req       request.Create
	timestamp time.Time
}

func New(req request.Create) commands.Command[response.Detailed] {
	return &command{
		req:       req,
		timestamp: time.Now().UTC(),
	}
}

func (c *command) Run(ctx context.Context) (response.Detailed, error) {
	var (
		record = transaction.Record{
			ID:           -1,
			SourceID:     c.req.SourceID,
			TargetID:     c.req.TargetID,
			SourceAmount: c.req.SourceAmount,
			TargetAmount: c.req.TargetAmount,
			Notes:        c.req.Notes,
			IssuedAt:     c.req.IssuedAt.UTC(),
			ExecutedAt:   c.req.ExecutedAt,
			DeletedAt:    nullable.Type[time.Time]{},
			CreatedAt:    c.timestamp,
			UpdatedAt:    c.timestamp,
		}
		postgres = postgresql_database.New()
		broker   = brokers.New(nil)

		source account.Record
		target account.Record
		res    response.Detailed
	)

	if record.SourceID == record.TargetID {
		return res, errors.New("circular transaction")
	}

	conn, err := postgres.Conn(ctx)
	if err != nil {
		return res, errors.Join(errors.New("failed to retrieve database connection"), err)
	}
	defer conn.Close()

	source, err = c.findAccount(ctx, conn, record.SourceID)
	if err != nil {
		return res, errors.Join(errors.New("transaction source not found"), err)
	}

	target, err = c.findAccount(ctx, conn, record.TargetID)
	if err != nil {
		return res, errors.Join(errors.New("transaction target not found"), err)
	}

	if target.Currency == source.Currency {
		record.TargetAmount = record.SourceAmount
	}

	if record.ExecutedAt.Valid {
		record.ExecutedAt = nullable.New(record.ExecutedAt.Val.UTC())
	}

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return res, errors.Join(errors.New("failed to begin database transaction"), err)
	}

	record, err = c.persistRecord(ctx, tx, record)
	if err != nil {
		return res, errors.Join(errors.New("failed to persist record"), err, tx.Rollback())
	}

	err = tx.Commit()
	if err != nil {
		return res, errors.Join(errors.New("failed to commit database transaction"), err)
	}

	res, err = detailed_query.New(record.ID).Find(ctx)
	if err != nil {
		return res, errors.Join(errors.New("failed to find persisted account"), err)
	}

	return res, broker.PublishCreated(message.Created{Record: record})
}

func (c *command) findAccount(ctx context.Context, conn *sql.Conn, id int64) (account.Record, error) {
	var record account.Record

	err := conn.QueryRowContext(
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
			WHERE deleted_at IS NULL
				AND id = $1
		`,
		id,
	).Scan(
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

	return record, err
}

func (c *command) persistRecord(ctx context.Context, tx *sql.Tx, t transaction.Record) (transaction.Record, error) {
	err := tx.QueryRowContext(
		ctx,
		`
			INSERT INTO transactions(
				source_id,
				target_id,
				source_amount,
				target_amount,
				notes,
				issued_at,
				executed_at,
				created_at,
				updated_at
			) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
			RETURNING id
		`,
		t.SourceID,
		t.TargetID,
		t.SourceAmount,
		t.TargetAmount,
		t.Notes,
		t.IssuedAt,
		t.ExecutedAt,
		t.CreatedAt,
		t.UpdatedAt,
	).Scan(&t.ID)

	return t, err
}

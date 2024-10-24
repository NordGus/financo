package transactions

import (
	"context"
	"database/sql"
	"errors"
	"financo/cmd/database/seed/accounts"
	"financo/core/domain/records/transaction"
	"fmt"
	"log"
	"time"
)

func SeedTransactions(
	ctx context.Context,
	seeds map[string]accounts.AccountRecord,
	conn *sql.Conn,
	timestamp time.Time,
) error {
	var summary uint = 0

	log.Println("\tseeding transactions")

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return errors.Join(errors.New("transactions: failed to seed"), err)
	}
	defer tx.Rollback()

	for i := 0; i < len(transactions); i++ {
		var (
			data   = transactions[i]
			source = seeds[data.Source.Key].Account
			target = seeds[data.Target.Key].Account
		)

		if data.Source.ParentKey.Valid {
			source = seeds[data.Source.ParentKey.Val].Children[data.Source.Key]
		}

		if data.Target.ParentKey.Valid {
			target = seeds[data.Target.ParentKey.Val].Children[data.Target.Key]
		}

		tr := transaction.Record{
			SourceID:     source.ID,
			TargetID:     target.ID,
			SourceAmount: data.SourceAmount,
			TargetAmount: data.TargetAmount,
			Notes:        data.Notes,
			IssuedAt:     data.IssuedAt(timestamp.UTC()),
			ExecutedAt:   data.ExecutedAt(timestamp.UTC()),
			DeletedAt:    data.DeletedAt(timestamp.UTC()),
			CreatedAt:    timestamp.UTC(),
			UpdatedAt:    timestamp.UTC(),
		}

		err := create(ctx, tr, tx)
		if err != nil {
			return errors.Join(
				fmt.Errorf("transactions: failed to seed transaction between %s and %s", source.Name, target.Name),
				err,
			)
		}

		summary += 1
	}

	err = tx.Commit()
	if err != nil {
		return errors.Join(errors.New("transactions: failed to seed"), err)
	}

	log.Printf("\t\t%d transactions seeded\n", summary)

	return nil
}

func create(ctx context.Context, tr transaction.Record, tx *sql.Tx) error {
	err := tx.QueryRowContext(
		ctx,
		`
		INSERT INTO
			transactions(
				source_id,
				target_id,
				source_amount,
				target_amount,
				notes,
				issued_at,
				executed_at,
				created_at,
				updated_at
			)
		VALUES
			($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id
		`,
		tr.SourceID,
		tr.TargetID,
		tr.SourceAmount,
		tr.TargetAmount,
		tr.Notes,
		tr.IssuedAt,
		tr.ExecutedAt,
		tr.CreatedAt,
		tr.UpdatedAt,
	).Scan(&tr.ID)

	return err
}

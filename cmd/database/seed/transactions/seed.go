package transactions

import (
	"context"
	"database/sql"
	"errors"
	"financo/cmd/database/seed/accounts"
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

	// implemented seeding

	err = tx.Commit()
	if err != nil {
		return errors.Join(errors.New("transactions: failed to seed"), err)
	}

	log.Printf("\t\t%d transactions seeded\n", summary)

	return nil
}

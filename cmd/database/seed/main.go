package main

import (
	"context"
	"financo/cmd/database/seed/accounts"
	"financo/cmd/database/seed/savings_goals"
	"financo/cmd/database/seed/transactions"
	"financo/services/postgresql_database"
	"log"
	"time"
)

func main() {
	var (
		ctx   = context.Background()
		start = time.Now()
	)

	log.Println("seeding database")

	conn, err := postgresql_database.New().Conn(ctx)
	if err != nil {
		log.Fatalf("seed: failed to connect to database:\n\t err: %v\n", err)
	}
	defer conn.Close()

	accountRecords, err := accounts.SeedAccounts(ctx, conn, start.UTC())
	if err != nil {
		log.Printf("failed to seed accounts:\n\t err: %s\n", err.Error())
	}

	err = transactions.SeedTransactions(ctx, accountRecords, conn, start.UTC())
	if err != nil {
		log.Printf("failed to seed transactions:\n\t err: %s\n", err.Error())
	}

	err = savings_goals.SeedSavingsGoals(ctx, conn, start.UTC())
	if err != nil {
		log.Printf("failed to seed savings goals:\n\t err: %s\n", err.Error())
	}

	log.Printf("database seeded (took %s)\n", time.Since(start))
}

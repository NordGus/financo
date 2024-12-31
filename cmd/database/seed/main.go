package main

import (
	"context"
	"financo/cmd/database/seed/accounts"
	"financo/cmd/database/seed/savings_goals"
	"financo/cmd/database/seed/transactions"
	"financo/services/message_buses"
	"financo/services/postgresql_database"
	"log"
	"os"
	"sync"
	"time"
)

func main() {
	var (
		wg    = new(sync.WaitGroup)
		ctx   = context.Background()
		start = time.Now()

		postgresqlService   = postgresql_database.New()
		messageBusesService = message_buses.Initialize(wg)
	)

	defer func() {
		if err := postgresqlService.Close(); err != nil {
			log.Printf("failed to close postgresql database connection: %s\n", err)
		}
	}()

	defer func() {
		if err := messageBusesService.Close(); err != nil {
			log.Printf("failed to close message busses connection: %s\n", err)
		}
	}()

	log.Println("seeding database")

	createdSG, err := savings_goals.CreateSavingsGoals(ctx)
	if err != nil {
		log.Println("failed to seed savings goals", err.Error())
		os.Exit(1)
	}

	conn, err := postgresqlService.Conn(ctx)
	if err != nil {
		log.Fatalf("seed: failed to connect to database:\n\t err: %v\n", err)
	}
	defer conn.Close()

	acc, err := accounts.SeedAccounts(ctx, start.UTC())
	if err != nil {
		log.Fatalf("failed to seed accounts:\n\t err: %s\n", err.Error())
	}

	err = transactions.SeedTransactions(ctx, acc, start.UTC())
	if err != nil {
		log.Fatalf("failed to seed transactions:\n\t err: %s\n", err.Error())
	}

	_, err = savings_goals.ArchiveSavingsGoals(ctx, createdSG)
	if err != nil {
		log.Println("failed to mark savings goals as achieve", err.Error())
		os.Exit(1)
	}

	log.Printf("database seeded (took %s)\n", time.Since(start))
}

package main

import (
	"context"
	"financo/cmd/database/seed/accounts"
	"financo/cmd/database/seed/categories"
	"financo/cmd/database/seed/savings_goals"
	"financo/cmd/database/seed/transactions"
	"financo/services/message_buses"
	"financo/services/postgresql_database"
	"financo/services/shutdown"
	"log"
	"sync"
	"time"
)

func main() {
	var (
		wg    = new(sync.WaitGroup)
		ctx   = context.Background()
		start = time.Now()

		pg = postgresql_database.New()
		mb = message_buses.Initialize(wg)
	)

	shutdown.Defer(shutdown.Closure{
		Name: "postgresql_database",
		Func: func() {
			if err := pg.Close(); err != nil {
				log.Printf("failed to close postgresql database connection: %s\n", err)
			}
			log.Println("database connection close")
		},
	})

	shutdown.Defer(shutdown.Closure{
		Name: "message_buses",
		Func: func() {
			if err := mb.Close(); err != nil {
				log.Printf("failed to close message busses connection: %s\n", err)
			}
			log.Println("message bus connection close")
		},
	})

	shutdown.Defer(shutdown.Closure{
		Name: "sync.WaitGroup.Wait",
		Func: func() { wg.Wait() },
	})

	log.Println("seeding database")

	createdSG, err := savings_goals.CreateSavingsGoals(ctx)
	if err != nil {
		log.Println("failed to seed savings goals, reason:", err.Error())
		shutdown.Exit(1)
	}

	acc, err := accounts.SeedAccounts(ctx, start.UTC())
	if err != nil {
		log.Println("failed to seed accounts, reason:", err.Error())
		shutdown.Exit(1)
	}

	cat, err := categories.SeedCategories(ctx, start.UTC())
	if err != nil {
		log.Println("failed to seed categories, reason:", err.Error())
		shutdown.Exit(1)
	}

	for key, id := range cat {
		acc[key] = id
	}

	err = transactions.SeedTransactions(ctx, acc, start.UTC())
	if err != nil {
		log.Println("failed to seed transactions, reason:", err.Error())
		shutdown.Exit(1)
	}

	_, err = savings_goals.AchieveSavingsGoals(ctx, createdSG)
	if err != nil {
		log.Println("failed to mark savings goals as achieve, reason:", err.Error())
		shutdown.Exit(1)
	}

	log.Printf("database seeded (took %s)\n", time.Since(start))
	shutdown.Exit(0)
}

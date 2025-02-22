package main

import (
	"context"
	"errors"
	"financo/cmd/database/seed/accounts"
	"financo/cmd/database/seed/categories"
	"financo/cmd/database/seed/savings_goals"
	"financo/cmd/database/seed/transactions"
	"financo/services/message_buses"
	"financo/services/postgresql_database"
	"financo/services/shutdown"
	"log"
	"time"
)

func main() {
	var (
		ctx   = context.Background()
		start = time.Now()

		_ = postgresql_database.New()
		_ = message_buses.New()
	)

	log.Println("seeding database")

	createdSG, err := savings_goals.CreateSavingsGoals(ctx)
	if err != nil {
		shutdown.ExitWithErr(1, errors.Join(errors.New("database/seed: failed to seed savings goals"), err))
	}

	acc, err := accounts.SeedAccounts(ctx, start.UTC())
	if err != nil {
		log.Println("failed to seed accounts, reason:", err.Error())
		shutdown.ExitWithErr(2, errors.Join(errors.New("database/seed: failed to seed savings goals"), err))
	}

	cat, err := categories.SeedCategories(ctx, start.UTC())
	if err != nil {
		log.Println("failed to seed categories, reason:", err.Error())
		shutdown.Exit(3)
	}

	for key, id := range cat {
		acc[key] = id
	}

	err = transactions.SeedTransactions(ctx, acc, start.UTC())
	if err != nil {
		log.Println("failed to seed transactions, reason:", err.Error())
		shutdown.Exit(4)
	}

	_, err = savings_goals.AchieveSavingsGoals(ctx, createdSG)
	if err != nil {
		log.Println("failed to mark savings goals as achieve, reason:", err.Error())
		shutdown.Exit(5)
	}

	log.Printf("database seeded (took %s)\n", time.Since(start))
	shutdown.Exit(0)
}

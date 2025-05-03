package main

import (
	"context"
	"errors"
	"financo/cmd/database/seed/accounts"
	"financo/cmd/database/seed/categories"
	"financo/cmd/database/seed/savings_goals"
	"financo/cmd/database/seed/transactions"
	"financo/lib/currency"
	"financo/services/message_buses"
	"financo/services/postgresql_database"
	"financo/services/shutdown"
	"log"
	"time"
)

func main() {
	shutdown.Arm()

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

	ids := make(map[string]int64, len(acc)+len(cat))
	curr := make(map[string]currency.Type, len(acc)+len(cat))

	for key, val := range acc {
		ids[key] = val.ID
		curr[key] = val.Currency
	}

	for key, val := range cat {
		ids[key] = val.ID
		curr[key] = val.Currency
	}

	err = transactions.SeedTransactions(ctx, ids, curr, start.UTC())
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

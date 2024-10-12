package savings_goals

import (
	"context"
	"database/sql"
	"errors"
	"financo/server/types/records/achievement/savings_goal"
	"financo/server/types/shared/currency"
	"fmt"
	"log"
	"time"
)

func SeedSavingsGoals(ctx context.Context, conn *sql.Conn, timestamp time.Time) error {
	var (
		summary = make(map[currency.Type]uint, 10)
		savings = make(map[currency.Type]int64, 10)
	)

	log.Println("\tseeding savings goals achievements")

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return errors.Join(errors.New("savings_goals: failed to seed"), err)
	}
	defer tx.Rollback()

	for i := 0; i < len(achievements); i++ {
		var (
			goal       = achievements[i].Record
			achievedAt = achievements[i].AchievedAt
			deletedAt  = achievements[i].DeletedAt
			saved      = savings[goal.Settings.Currency]
			touched    = false
		)

		goal.AchievedAt = achievedAt(timestamp)
		goal.DeletedAt = deletedAt(timestamp)
		goal.CreatedAt = timestamp
		goal.UpdatedAt = timestamp

		if !goal.AchievedAt.Valid && !goal.DeletedAt.Valid && saved > 0 {
			if saved >= goal.Settings.Target {
				goal.Settings.Saved = goal.Settings.Target
				touched = true
			}

			if goal.Settings.Target > saved && !touched {
				goal.Settings.Saved = saved
			}

			savings[goal.Settings.Currency] -= goal.Settings.Saved
		}

		err := create(ctx, goal, tx)
		if err != nil {
			return errors.Join(
				fmt.Errorf("savings_goals: failed to seed savings goal %s", goal.Name),
				err,
			)
		}

		summary[goal.Settings.Currency] += 1
	}

	err = tx.Commit()
	if err != nil {
		return errors.Join(errors.New("savings_goals: failed to seed"), err)
	}

	// printing summary
	for kind, count := range summary {
		log.Printf("\t\t%d savings goals seeded for %v\n", count, kind)
	}

	return nil
}

func create(ctx context.Context, goal savings_goal.Record, tx *sql.Tx) error {
	return tx.QueryRowContext(
		ctx,
		``,
		goal.Kind,
		goal.Name,
		goal.Description,
		goal.Settings,
		goal.AchievedAt,
		goal.DeletedAt,
		goal.CreatedAt,
		goal.UpdatedAt,
	).Scan(&goal.ID)
}

package savings_goals

import (
	"context"
	"database/sql"
	"errors"
	"financo/lib/currency"
	"financo/models/account"
	"financo/models/achievement/savings_goal"
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

	savings, err = getSavings(ctx, savings, tx)
	if err != nil {
		return errors.Join(errors.New("savings_goals: failed to retrieve savings"), err)
	}

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
		`
		INSERT INTO
			achievements(
				kind,
				name,
				description,
				settings,
				achieved_at,
				deleted_at,
				created_at,
				updated_at
			)
		VALUES
			($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id
		`,
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

func getSavings(ctx context.Context, savings map[currency.Type]int64, tx *sql.Tx) (map[currency.Type]int64, error) {
	rows, err := tx.QueryContext(
		ctx,
		`
		SELECT SUM(
				CASE
					WHEN tr.target_id = acc.id THEN tr.target_amount
					WHEN tr.source_id = acc.id THEN - tr.source_amount
					ELSE 0
				END
			), acc.currency
		FROM
			transactions tr
			INNER JOIN accounts acc ON acc.id = tr.target_id
			OR acc.id = tr.source_id
		WHERE
			acc.kind = $1
			AND tr.deleted_at IS NULL
			AND acc.deleted_at IS NULL
			AND acc.archived_at IS NULL
			AND (
				tr.executed_at IS NULL
				OR tr.executed_at <= NOW()
			)
			AND tr.issued_at <= NOW()
		GROUP BY
			acc.currency
		ORDER BY acc.currency
		`,
		account.CapitalSavings,
	)
	if err != nil {
		return savings, err
	}
	defer rows.Close()

	for rows.Next() {
		var (
			cur currency.Type
			sav int64
		)

		err = rows.Scan(&sav, &cur)
		if err != nil {
			return savings, err
		}

		savings[cur] = sav
	}

	return savings, nil
}

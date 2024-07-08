package main

import (
	"context"
	"errors"
	"financo/server/types/generic/nullable"
	"financo/server/types/records/account"
	"financo/server/types/records/transaction"
	"financo/server/types/shared/currency"
	"financo/server/types/shared/icon"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/jackc/pgx/v5"
)

type capitalNormalAccount struct {
	Account account.Record
	History account.Record

	WithHistory bool
	HistoryAt   time.Time
	Capital     int64
}

func main() {
	log.Println("seeding database")

	ctx := context.Background()
	executedAt := time.Now()
	conn, err := pgx.Connect(ctx, os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatalf("failed to connect to database:\n\t err: %v\n", err)
	}

	defer func() {
		if err := conn.Close(context.TODO()); err != nil {
			log.Printf("failed to create capital normal accounts:\n\t err: %v\n", err)
		}
	}()

	tx, err := conn.Begin(ctx)
	if err != nil {
		log.Printf("failed to create capital normal accounts:\n\t err: %v\n", err)
	}
	defer tx.Rollback(context.TODO())

	capitalNormalAccounts, err := createCapitalNormalAccounts(ctx, tx, executedAt)
	if err != nil {
		log.Fatalf("failed to create capital normal accounts:\n\t err: %v\n", err)
	}

	tx.Rollback(ctx)

	fmt.Println(capitalNormalAccounts)

	err = tx.Commit(ctx)
	if err != nil {
		log.Fatalf("failed to commit seeding:\n\t err: %v\n", err)
	}

	fmt.Println("seed data base")
}

func createCapitalNormalAccounts(ctx context.Context, tx pgx.Tx, executionTime time.Time) ([]capitalNormalAccount, error) {
	var (
		seeded         = false
		seedCheckQuery = "SELECT COALESCE(COUNT(id), 0) > 0 FROM accounts WHERE kind = $1"
		insertQuery    = "INSERT INTO accounts(parent_id, kind, currency, name, description, color, icon, capital, archived_at, deleted_at, created_at, updated_at) " +
			"VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) " +
			"RETURNING id"

		accounts = []capitalNormalAccount{
			{
				Account: account.Record{
					// Doesn't need ID because is a new record.
					// Doesn't need ParentID because is a parent record.
					Kind:        account.CapitalNormal,
					Currency:    currency.EUR,
					Name:        "My Personal Bank Account",
					Description: nullable.New("The account where I get my paycheck"),
					Color:       "#eb8934",
					Icon:        icon.Base,
					// Doesn't need Capital because is not a debt record.
					// Doesn't need ArchivedAt because is not archived.
					// Doesn't need DeletedAt because is not deleted.
					CreatedAt: executionTime,
					UpdatedAt: executionTime,
				},
				History: account.Record{
					// Doesn't need ID because is a new record.
					// ParentID will be added later after the creation of its corresponding account.
					Kind:        account.SystemHistoric,
					Currency:    currency.EUR,
					Name:        "My Personal Bank Account (History)",
					Description: nullable.New("This is an automatically created account by the system to represent the lost balance history of the parent account. DO NOT MODIFY NOR DELETE"),
					Color:       "#8c8c8c",
					Icon:        icon.Base,
					// Doesn't need Capital because is not a debt record.
					// Doesn't need ArchivedAt because is not archived.
					// Doesn't need DeletedAt because is not deleted.
					CreatedAt: executionTime,
					UpdatedAt: executionTime,
				},
				WithHistory: true,
				HistoryAt:   time.Date(2014, 7, 21, 0, 0, 0, 0, executionTime.Location()),
				Capital:     133742,
			},
			{
				Account: account.Record{
					// Doesn't need ID because is a new record.
					// Doesn't need ParentID because is a parent record.
					Kind:        account.CapitalNormal,
					Currency:    currency.EUR,
					Name:        "Freelance bank account",
					Description: nullable.New("Where I get paid for my freelance job"),
					Color:       "#34baeb",
					Icon:        icon.Base,
					// Doesn't need Capital because is not a debt record.
					ArchivedAt: nullable.New(executionTime.Add(-((time.Hour * 24 * 90) + (time.Hour * 7)))),
					// Doesn't need DeletedAt because is not deleted.
					CreatedAt: executionTime,
					UpdatedAt: executionTime,
				},
				History: account.Record{
					// Doesn't need ID because is a new record.
					// ParentID will be added later after the creation of its corresponding account.
					Kind:        account.SystemHistoric,
					Currency:    currency.EUR,
					Name:        "Freelance bank account (History)",
					Description: nullable.New("This is an automatically created account by the system to represent the lost balance history of the parent account. DO NOT MODIFY NOR DELETE"),
					Color:       "#8c8c8c",
					Icon:        icon.Base,
					// Doesn't need Capital because is not a debt record.
					ArchivedAt: nullable.New(executionTime.Add(-((time.Hour * 24 * 90) + (time.Hour * 7)))),
					// Doesn't need DeletedAt because is not deleted.
					CreatedAt: executionTime,
					UpdatedAt: executionTime,
				},
			},
		}
	)

	err := tx.QueryRow(ctx, seedCheckQuery, account.CapitalNormal).Scan(&seeded)
	if err != nil {
		return accounts, err
	}

	if seeded {
		return accounts, errors.New("database seed: database is already seeded")
	}

	for i := 0; i < len(accounts); i++ {
		account := accounts[i].Account
		history := accounts[i].History

		err = tx.QueryRow(
			ctx,
			insertQuery,
			account.ParentID,
			account.Kind,
			account.Currency,
			account.Name,
			account.Description,
			account.Color,
			account.Icon,
			account.Capital,
			account.ArchivedAt,
			account.DeletedAt,
			account.CreatedAt,
			account.UpdatedAt,
		).Scan(&account.ID)
		if err != nil {
			return accounts, err
		}

		history.ParentID = nullable.New(account.ID)
		history.Currency = account.Currency

		err = tx.QueryRow(
			ctx,
			insertQuery,
			history.ParentID,
			history.Kind,
			history.Currency,
			history.Name,
			history.Description,
			history.Color,
			history.Icon,
			history.Capital,
			history.ArchivedAt,
			history.DeletedAt,
			history.CreatedAt,
			history.UpdatedAt,
		).Scan(&history.ID)
		if err != nil {
			return accounts, err
		}
		accounts[i].Account = account
		accounts[i].History = history

		if !accounts[i].WithHistory || accounts[i].Capital == 0 {
			continue
		}

		tr := transaction.Record{
			Notes:      nullable.New("This transaction was created automatically by the system. DO NOT MODIFY"),
			IssuedAt:   accounts[i].HistoryAt,
			ExecutedAt: nullable.New(accounts[i].HistoryAt),
			CreatedAt:  executionTime,
			UpdatedAt:  executionTime,
		}

		if accounts[i].Capital < 0 {
			tr.SourceID = account.ID
			tr.TargetID = history.ID
			tr.SourceAmount = -accounts[i].Capital
			tr.TargetAmount = -accounts[i].Capital
		} else {
			tr.SourceID = history.ID
			tr.TargetID = account.ID
			tr.SourceAmount = accounts[i].Capital
			tr.TargetAmount = accounts[i].Capital
		}

		results, err := tx.Exec(
			ctx,
			"INSERT INTO transactions(source_id, target_id, source_amount, target_amount, notes, issued_at, executed_at, created_at, updated_at)"+
				"VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
			tr.SourceID,
			tr.TargetID,
			tr.SourceAmount,
			tr.TargetAmount,
			tr.Notes,
			tr.IssuedAt,
			tr.ExecutedAt,
			tr.CreatedAt,
			tr.UpdatedAt,
		)
		if err != nil {
			return accounts, err
		}
		if results.RowsAffected() == 0 {
			return accounts, fmt.Errorf("database seed: failed to create history transaction for capital account")
		}
	}

	return accounts, nil
}

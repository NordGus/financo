package main

import (
	"context"
	"database/sql"
	"financo/cmd/database/seed/accounts"
	"financo/cmd/database/seed/transactions"
	"financo/server/services/postgres_database"
	"financo/server/types/generic/nullable"
	"financo/server/types/records/account"
	"financo/server/types/records/transaction"
	"log"
	"time"
)

const (
	insertHistoryTransactionQuery = "INSERT INTO transactions(source_id, target_id, source_amount, target_amount, notes, issued_at, executed_at, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id"
)

type mappedAccount struct {
	Account  account.Record
	Children map[string]account.Record
}

func main() {
	log.Println("seeding database")
	var (
		ctx   = context.Background()
		start = time.Now()
	)

	conn, err := postgres_database.New().Conn(ctx)
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

	log.Printf("database seeded (took %s)\n", time.Since(start))
}

func createAllTransactions(
	ctx context.Context,
	tx *sql.Tx,
	accounts map[string]mappedAccount,
	executionTime time.Time,
) ([]transaction.Record, error) {
	transactions := []transaction.Record{
		{ // Paycheck
			SourceID:     accounts["paycheck income"].Children["day job"].ID,
			TargetID:     accounts["bank account"].Account.ID,
			SourceAmount: 2_000_00,
			TargetAmount: 2_000_00,
			// Doesn't have a Notes
			IssuedAt: time.Date(
				executionTime.Year(),
				executionTime.Month(),
				27, 0, 0, 0, 0,
				executionTime.Location(),
			).AddDate(0, -1, 0),
			ExecutedAt: nullable.New(
				time.Date(
					executionTime.Year(),
					executionTime.Month(),
					27, 0, 0, 0, 0,
					executionTime.Location(),
				).AddDate(0, -1, 0),
			),
			// Is not deleted
			CreatedAt: executionTime,
			UpdatedAt: executionTime,
		},
		{ // Monthly Savings
			SourceID:     accounts["bank account"].Account.ID,
			TargetID:     accounts["savings account"].Account.ID,
			SourceAmount: 300_00,
			TargetAmount: 300_00,
			Notes:        nullable.New("Monthly savings"),
			IssuedAt: time.Date(
				executionTime.Year(),
				executionTime.Month(),
				1, 0, 0, 0, 0,
				executionTime.Location(),
			),
			ExecutedAt: nullable.New(
				time.Date(
					executionTime.Year(),
					executionTime.Month(),
					1, 0, 0, 0, 0,
					executionTime.Location(),
				),
			),
			// Is not deleted
			CreatedAt: executionTime,
			UpdatedAt: executionTime,
		},
		{ // Credit Card Payment
			SourceID:     accounts["bank account"].Account.ID,
			TargetID:     accounts["credit card"].Account.ID,
			SourceAmount: 150_00,
			TargetAmount: 150_00,
			// Doesn't have any notes
			IssuedAt: time.Date(
				executionTime.Year(),
				executionTime.Month(),
				4, 0, 0, 0, 0,
				executionTime.Location(),
			),
			ExecutedAt: nullable.New(
				time.Date(
					executionTime.Year(),
					executionTime.Month(),
					4, 0, 0, 0, 0,
					executionTime.Location(),
				),
			),
			// Is not deleted
			CreatedAt: executionTime,
			UpdatedAt: executionTime,
		},
		{ // Car Payment
			SourceID:     accounts["bank account"].Account.ID,
			TargetID:     accounts["car loan"].Account.ID,
			SourceAmount: 100_00,
			TargetAmount: 100_00,
			// Doesn't have any notes
			IssuedAt: time.Date(
				executionTime.Year(),
				executionTime.Month(),
				7, 0, 0, 0, 0,
				executionTime.Location(),
			),
			ExecutedAt: nullable.New(
				time.Date(
					executionTime.Year(),
					executionTime.Month(),
					7, 0, 0, 0, 0,
					executionTime.Location(),
				),
			),
			// Is not deleted
			CreatedAt: executionTime,
			UpdatedAt: executionTime,
		},
		{ // Old Freelance payment
			SourceID:     accounts["paycheck income"].Children["freelancing"].ID,
			TargetID:     accounts["freelance bank account"].Account.ID,
			SourceAmount: 800_00,
			TargetAmount: 800_00,
			Notes:        nullable.New("Wrestling Gig"),
			IssuedAt:     executionTime.AddDate(0, 0, -100),
			ExecutedAt:   nullable.New(executionTime.AddDate(0, 0, -100)),
			// Is not deleted
			CreatedAt: executionTime,
			UpdatedAt: executionTime,
		},
		{ // Old Freelance Savings
			SourceID:     accounts["freelance bank account"].Account.ID,
			TargetID:     accounts["savings account"].Account.ID,
			SourceAmount: 500_00,
			TargetAmount: 500_00,
			Notes:        nullable.New("For the piggy bag"),
			IssuedAt:     executionTime.AddDate(0, 0, -100),
			ExecutedAt:   nullable.New(executionTime.AddDate(0, 0, -100)),
			// Is not deleted
			CreatedAt: executionTime,
			UpdatedAt: executionTime,
		},
		{ // Old Freelance paying to credit card
			SourceID:     accounts["freelance bank account"].Account.ID,
			TargetID:     accounts["credit card"].Account.ID,
			SourceAmount: 300_00,
			TargetAmount: 300_00,
			// Doesn't have any notes
			IssuedAt:   executionTime.AddDate(0, 0, -100),
			ExecutedAt: nullable.New(executionTime.AddDate(0, 0, -100)),
			// Is not deleted
			CreatedAt: executionTime,
			UpdatedAt: executionTime,
		},
		{ // Teaching payment
			SourceID:     accounts["paycheck income"].Children["teaching"].ID,
			TargetID:     accounts["bank account"].Account.ID,
			SourceAmount: 500_00,
			TargetAmount: 500_00,
			// Doesn't have any notes
			IssuedAt:   executionTime.AddDate(0, 0, -10),
			ExecutedAt: nullable.New(executionTime.AddDate(0, 0, -10)),
			// Is not deleted
			CreatedAt: executionTime,
			UpdatedAt: executionTime,
		},
		{ // Personal loan with morgan (I'm owed)
			SourceID:     accounts["morgan loan"].Account.ID,
			TargetID:     accounts["bank account"].Account.ID,
			SourceAmount: 200_00,
			TargetAmount: 200_00,
			// Doesn't have any notes
			IssuedAt:   executionTime.AddDate(0, 0, -3),
			ExecutedAt: nullable.New(executionTime.AddDate(0, 0, -3)),
			// Is not deleted
			CreatedAt: executionTime,
			UpdatedAt: executionTime,
		},
		{ // Transport expense without ExecutedAt
			SourceID:     accounts["bank account"].Account.ID,
			TargetID:     accounts["transport expense"].Account.ID,
			SourceAmount: 50_00,
			TargetAmount: 50_00,
			// Doesn't have any notes
			IssuedAt: executionTime,
			// It doesn't have ExecutedAt because it have not been processed by the bank.
			// Is not deleted
			CreatedAt: executionTime,
			UpdatedAt: executionTime,
		},
		{ // Hobby expense without ExecutedAt
			SourceID:     accounts["bank account"].Account.ID,
			TargetID:     accounts["market expense"].Children["gardening supplies"].ID,
			SourceAmount: 80_00,
			TargetAmount: 80_00,
			// Doesn't have any notes
			IssuedAt: executionTime,
			// It doesn't have ExecutedAt because it have not been processed by the bank.
			// Is not deleted
			CreatedAt: executionTime,
			UpdatedAt: executionTime,
		},
		{ // Savings in the US, different currency account
			SourceID:     accounts["bank account"].Account.ID,
			TargetID:     accounts["us savings account"].Account.ID,
			SourceAmount: 150_00,
			TargetAmount: 163_50,
			// Doesn't have any notes
			IssuedAt:   executionTime.AddDate(0, 0, -1),
			ExecutedAt: nullable.New(executionTime),
			// Is not deleted
			CreatedAt: executionTime,
			UpdatedAt: executionTime,
		},
		{
			SourceID:     accounts["bank account"].Account.ID,
			TargetID:     accounts["market expense"].Account.ID,
			SourceAmount: 100_00,
			TargetAmount: 100_00,
			// Doesn't have any notes
			IssuedAt:   executionTime.AddDate(0, 0, -7),
			ExecutedAt: nullable.New(executionTime.AddDate(0, 0, -5)),
			// Is not deleted
			CreatedAt: executionTime,
			UpdatedAt: executionTime,
		},
		{
			SourceID:     accounts["bank account"].Account.ID,
			TargetID:     accounts["market expense"].Children["fruit shop"].ID,
			SourceAmount: 40_00,
			TargetAmount: 40_00,
			// Doesn't have any notes
			IssuedAt:   executionTime,
			ExecutedAt: nullable.New(executionTime),
			// Is not deleted
			CreatedAt: executionTime,
			UpdatedAt: executionTime,
		},
		{
			SourceID:     accounts["bank account"].Account.ID,
			TargetID:     accounts["market expense"].Children["food"].ID,
			SourceAmount: 150_00,
			TargetAmount: 150_00,
			// Doesn't have any notes
			IssuedAt: executionTime.AddDate(0, 0, -1),
			// It doesn't have ExecutedAt because it have not been processed by the bank.
			// Is not deleted
			CreatedAt: executionTime,
			UpdatedAt: executionTime,
		},
		{
			SourceID:     accounts["carlos loan"].Account.ID,
			TargetID:     accounts["bank account"].Account.ID,
			SourceAmount: 80_00,
			TargetAmount: 80_00,
			// Doesn't have any notes
			IssuedAt:   executionTime.AddDate(0, -6, 0),
			ExecutedAt: nullable.New(executionTime.AddDate(0, -6, 0)),
			// Is not deleted
			CreatedAt: executionTime,
			UpdatedAt: executionTime,
		},
		{
			SourceID:     accounts["bank account"].Account.ID,
			TargetID:     accounts["laptop credit"].Account.ID,
			SourceAmount: 1_234_69,
			TargetAmount: 1_234_69,
			// Doesn't have any notes
			IssuedAt:   executionTime.AddDate(-1, -6, 0),
			ExecutedAt: nullable.New(executionTime.AddDate(-1, -6, 0)),
			// Is not deleted
			CreatedAt: executionTime,
			UpdatedAt: executionTime,
		},
		{ // Next Credit Card Payment
			SourceID:     accounts["bank account"].Account.ID,
			TargetID:     accounts["credit card"].Account.ID,
			SourceAmount: 150_00,
			TargetAmount: 150_00,
			// Doesn't have any notes
			IssuedAt: time.Date(
				executionTime.Year(),
				executionTime.Month(),
				4, 0, 0, 0, 0,
				executionTime.Location(),
			).AddDate(0, 1, 0),
			ExecutedAt: nullable.New(
				time.Date(
					executionTime.Year(),
					executionTime.Month(),
					4, 0, 0, 0, 0,
					executionTime.Location(),
				).AddDate(0, 1, 0),
			),
			// Is not deleted
			CreatedAt: executionTime,
			UpdatedAt: executionTime,
		},
		{ // Next Car Payment
			SourceID:     accounts["bank account"].Account.ID,
			TargetID:     accounts["car loan"].Account.ID,
			SourceAmount: 100_00,
			TargetAmount: 100_00,
			// Doesn't have any notes
			IssuedAt: time.Date(
				executionTime.Year(),
				executionTime.Month(),
				7, 0, 0, 0, 0,
				executionTime.Location(),
			).AddDate(0, 1, 0),
			ExecutedAt: nullable.New(
				time.Date(
					executionTime.Year(),
					executionTime.Month(),
					7, 0, 0, 0, 0,
					executionTime.Location(),
				).AddDate(0, 1, 0),
			),
			// Is not deleted
			CreatedAt: executionTime,
			UpdatedAt: executionTime,
		},
	}

	for i := 0; i < len(transactions); i++ {
		tr := transactions[i]

		tr, err := createTransaction(ctx, tx, tr)
		if err != nil {
			return transactions, err
		}

		transactions[i] = tr
	}

	return transactions, nil
}

func createTransaction(
	ctx context.Context,
	tx *sql.Tx,
	tr transaction.Record,
) (transaction.Record, error) {
	if tr.SourceAmount < 0 {
		oldSourceID := tr.SourceID

		tr.SourceID = tr.TargetID
		tr.TargetID = oldSourceID

		tr.SourceAmount = -tr.SourceAmount
		tr.TargetAmount = -tr.TargetAmount
	}

	err := tx.QueryRowContext(
		ctx,
		insertHistoryTransactionQuery,
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

	return tr, err
}

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

const (
	insertQuery = "INSERT INTO accounts(parent_id, kind, currency, name, description, color, icon, capital, archived_at, deleted_at, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id"

	insertHistoryTransactionQuery = "INSERT INTO transactions(source_id, target_id, source_amount, target_amount, notes, issued_at, executed_at, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)"
)

type accountWithHistory struct {
	Account account.Record
	History account.Record

	WithHistory bool
	HistoryAt   time.Time
	Capital     int64
}

type accountWithChildrenAndNoHistory struct {
	Account  account.Record
	Children []account.Record
}

func main() {
	log.Println("seeding database")
	var (
		ctx        = context.Background()
		executedAt = time.Now()
		start      = time.Now()
	)

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

	count := len(capitalNormalAccounts) * 2
	log.Printf("capital normal accounts seeded, %d accounts added\n", count)

	capitalSavingsAccounts, err := createCapitalSavingsAccounts(ctx, tx, executedAt)
	if err != nil {
		log.Fatalf("failed to create capital savings accounts:\n\t err: %v\n", err)
	}

	count = len(capitalSavingsAccounts) * 2
	log.Printf("capital savings accounts seeded, %d accounts added\n", count)

	debtLoanAccounts, err := createDebtLoanAccounts(ctx, tx, executedAt)
	if err != nil {
		log.Fatalf("failed to create debt loan accounts:\n\t err: %v\n", err)
	}

	count = len(debtLoanAccounts) * 2
	log.Printf("debt loan accounts seeded, %d accounts added\n", count)

	debtCreditAccounts, err := createDebtCreditAccounts(ctx, tx, executedAt)
	if err != nil {
		log.Fatalf("failed to create debt credit accounts:\n\t err: %v\n", err)
	}

	count = len(debtCreditAccounts) * 2
	log.Printf("debt credit accounts seeded, %d accounts added\n", count)

	incomeAccounts, err := createExternalIncomeAccounts(ctx, tx, executedAt)
	if err != nil {
		log.Fatalf("failed to create external income accounts:\n\t err: %v\n", err)
	}

	count = len(incomeAccounts)
	for i := 0; i < len(incomeAccounts); i++ {
		count += len(incomeAccounts[i].Children)
	}
	log.Printf("external income accounts seeded, %d accounts added\n", count)

	expenseAccounts, err := createExternalExpenseAccounts(ctx, tx, executedAt)
	if err != nil {
		log.Fatalf("failed to create external expense accounts:\n\t err: %v\n", err)
	}

	count = len(expenseAccounts)
	for i := 0; i < len(expenseAccounts); i++ {
		count += len(expenseAccounts[i].Children)
	}
	log.Printf("external expense accounts seeded, %d accounts added\n", count)

	err = tx.Commit(ctx)
	if err != nil {
		log.Fatalf("failed to commit seeding:\n\t err: %v\n", err)
	}

	log.Printf("database seeded (took %s)\n", time.Since(start))
}

func createCapitalNormalAccounts(
	ctx context.Context,
	tx pgx.Tx,
	executionTime time.Time,
) ([]accountWithHistory, error) {
	accounts := []accountWithHistory{
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

	accounts, err := createAccountsWithHistory(ctx, tx, accounts...)
	if err != nil {
		return accounts, errors.Join(
			fmt.Errorf("failed to seed capital normal accounts"),
			err,
		)
	}

	return accounts, nil
}

func createCapitalSavingsAccounts(
	ctx context.Context,
	tx pgx.Tx,
	executionTime time.Time,
) ([]accountWithHistory, error) {
	accounts := []accountWithHistory{
		{
			Account: account.Record{
				// Doesn't need ID because is a new record.
				// Doesn't need ParentID because is a parent record.
				Kind:        account.CapitalSavings,
				Currency:    currency.EUR,
				Name:        "My Savings Account",
				Description: nullable.New("The account where I store my savings"),
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
				Name:        "My Savings Account (History)",
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
			HistoryAt:   time.Date(2020, 10, 8, 0, 0, 0, 0, executionTime.Location()),
			Capital:     42,
		},
		{
			Account: account.Record{
				// Doesn't need ID because is a new record.
				// Doesn't need ParentID because is a parent record.
				Kind:     account.CapitalSavings,
				Currency: currency.USD,
				Name:     "My US Savings Account",
				// Doesn't need Description because it won't have.
				Color: "#34baeb",
				Icon:  icon.Base,
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
				Currency:    currency.USD,
				Name:        "My US Savings Account (History)",
				Description: nullable.New("This is an automatically created account by the system to represent the lost balance history of the parent account. DO NOT MODIFY NOR DELETE"),
				Color:       "#8c8c8c",
				Icon:        icon.Base,
				// Doesn't need Capital because is not a debt record.
				// Doesn't need ArchivedAt because is not archived.
				// Doesn't need DeletedAt because is not deleted.
				CreatedAt: executionTime,
				UpdatedAt: executionTime,
			},
		},
		{
			Account: account.Record{
				// Doesn't need ID because is a new record.
				// Doesn't need ParentID because is a parent record.
				Kind:     account.CapitalSavings,
				Currency: currency.EUR,
				Name:     "My German Savings Account",
				// Doesn't need Description because it won't have.
				Color: "#34baeb",
				Icon:  icon.Base,
				// Doesn't need Capital because is not a debt record.
				// Doesn't need ArchivedAt because is not archived.
				DeletedAt: nullable.New(executionTime),
				CreatedAt: executionTime,
				UpdatedAt: executionTime,
			},
			History: account.Record{
				// Doesn't need ID because is a new record.
				// ParentID will be added later after the creation of its corresponding account.
				Kind:        account.SystemHistoric,
				Currency:    currency.EUR,
				Name:        "My German Account (History)",
				Description: nullable.New("This is an automatically created account by the system to represent the lost balance history of the parent account. DO NOT MODIFY NOR DELETE"),
				Color:       "#8c8c8c",
				Icon:        icon.Base,
				// Doesn't need Capital because is not a debt record.
				// Doesn't need ArchivedAt because is not archived.
				DeletedAt: nullable.New(executionTime),
				CreatedAt: executionTime,
				UpdatedAt: executionTime,
			},
		},
	}

	accounts, err := createAccountsWithHistory(ctx, tx, accounts...)
	if err != nil {
		return accounts, errors.Join(
			fmt.Errorf("failed to seed capital savings accounts"),
			err,
		)
	}

	return accounts, nil
}

func createDebtLoanAccounts(
	ctx context.Context,
	tx pgx.Tx,
	executionTime time.Time,
) ([]accountWithHistory, error) {
	accounts := []accountWithHistory{
		{
			Account: account.Record{
				// Doesn't need ID because is a new record.
				// Doesn't need ParentID because is a parent record.
				Kind:        account.DebtLoan,
				Currency:    currency.EUR,
				Name:        "Car loan",
				Description: nullable.New("My japanese shit-box"),
				Color:       "#eb8934",
				Icon:        icon.Base,
				Capital:     500000,
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
				Name:        "Car loan (History)",
				Description: nullable.New("This is an automatically created account by the system to represent the lost balance history of the parent account. DO NOT MODIFY NOR DELETE"),
				Color:       "#8c8c8c",
				Icon:        icon.Base,
				// Doesn't need Capital because is not a debt record.
				// Doesn't need ArchivedAt because is not archived.
				// Doesn't need DeletedAt because is not deleted.
				CreatedAt: executionTime,
				UpdatedAt: executionTime,
			},
		},
		{
			Account: account.Record{
				// Doesn't need ID because is a new record.
				// Doesn't need ParentID because is a parent record.
				Kind:        account.DebtPersonal,
				Currency:    currency.EUR,
				Name:        "Morgan's Loan",
				Description: nullable.New("I helped Morgan with their rent"),
				Color:       "#34baeb",
				Icon:        icon.Base,
				Capital:     -50000,
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
				Name:        "Morgan's Loan (History)",
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
			HistoryAt:   time.Date(2023, 11, 5, 0, 0, 0, 0, executionTime.Location()),
			Capital:     30000,
		},
		{
			Account: account.Record{
				// Doesn't need ID because is a new record.
				// Doesn't need ParentID because is a parent record.
				Kind:        account.DebtPersonal,
				Currency:    currency.EUR,
				Name:        "Carlos' Lunch",
				Description: nullable.New("Carlos' catch up lunch"),
				Color:       "#34baeb",
				Icon:        icon.Base,
				Capital:     -8000,
				ArchivedAt:  nullable.New(executionTime),
				// Doesn't need DeletedAt because is not archived.
				CreatedAt: executionTime,
				UpdatedAt: executionTime,
			},
			History: account.Record{
				// Doesn't need ID because is a new record.
				// ParentID will be added later after the creation of its corresponding account.
				Kind:        account.SystemHistoric,
				Currency:    currency.EUR,
				Name:        "Carlos' Lunch (History)",
				Description: nullable.New("This is an automatically created account by the system to represent the lost balance history of the parent account. DO NOT MODIFY NOR DELETE"),
				Color:       "#8c8c8c",
				Icon:        icon.Base,
				// Doesn't need Capital because is not a debt record.
				ArchivedAt: nullable.New(executionTime),
				// Doesn't need DeletedAt because is not archived.
				CreatedAt: executionTime,
				UpdatedAt: executionTime,
			},
			WithHistory: true,
			HistoryAt:   time.Date(2021, 10, 11, 0, 0, 0, 0, executionTime.Location()),
			Capital:     -8000,
		},
	}

	accounts, err := createAccountsWithHistory(ctx, tx, accounts...)
	if err != nil {
		return accounts, errors.Join(
			fmt.Errorf("failed to seed debt loan accounts"),
			err,
		)
	}

	return accounts, nil
}

func createDebtCreditAccounts(
	ctx context.Context,
	tx pgx.Tx,
	executionTime time.Time,
) ([]accountWithHistory, error) {
	accounts := []accountWithHistory{
		{
			Account: account.Record{
				// Doesn't need ID because is a new record.
				// Doesn't need ParentID because is a parent record.
				Kind:        account.DebtCredit,
				Currency:    currency.EUR,
				Name:        "Credit Card",
				Description: nullable.New("My bank's credit card"),
				Color:       "#eb8934",
				Icon:        icon.Base,
				Capital:     200000,
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
				Name:        "Credit Card (History)",
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
			HistoryAt:   time.Date(2023, 10, 11, 0, 0, 0, 0, executionTime.Location()),
			Capital:     -8000,
		},
		{
			Account: account.Record{
				// Doesn't need ID because is a new record.
				// Doesn't need ParentID because is a parent record.
				Kind:     account.DebtCredit,
				Currency: currency.EUR,
				Name:     "Laptop financing Credit Line",
				// Doesn't need Description because it won't have.
				Color:      "#34baeb",
				Icon:       icon.Base,
				Capital:    250000,
				ArchivedAt: nullable.New(executionTime),
				// Doesn't need DeletedAt because is not deleted.
				CreatedAt: executionTime,
				UpdatedAt: executionTime,
			},
			History: account.Record{
				// Doesn't need ID because is a new record.
				// ParentID will be added later after the creation of its corresponding account.
				Kind:        account.SystemHistoric,
				Currency:    currency.EUR,
				Name:        "Laptop financing Credit Line (History)",
				Description: nullable.New("This is an automatically created account by the system to represent the lost balance history of the parent account. DO NOT MODIFY NOR DELETE"),
				Color:       "#8c8c8c",
				Icon:        icon.Base,
				// Doesn't need Capital because is not a debt record.
				ArchivedAt: nullable.New(executionTime),
				// Doesn't need DeletedAt because is not deleted.
				CreatedAt: executionTime,
				UpdatedAt: executionTime,
			},
			WithHistory: true,
			HistoryAt:   time.Date(2020, 9, 15, 0, 0, 0, 0, executionTime.Location()),
			Capital:     -123469,
		},
	}

	accounts, err := createAccountsWithHistory(ctx, tx, accounts...)
	if err != nil {
		return accounts, errors.Join(
			fmt.Errorf("failed to seed debt credit accounts"),
			err,
		)
	}

	return accounts, nil
}

func createExternalIncomeAccounts(
	ctx context.Context,
	tx pgx.Tx,
	executionTime time.Time,
) ([]accountWithChildrenAndNoHistory, error) {
	accounts := []accountWithChildrenAndNoHistory{
		{
			Account: account.Record{
				// Doesn't need ID because is a new record.
				// Doesn't need ParentID because is a parent record.
				Kind:        account.ExternalIncome,
				Currency:    currency.EUR,
				Name:        "Paycheck",
				Description: nullable.New("Where the bread comes from"),
				Color:       "#eb8934",
				Icon:        icon.Base,
				// Doesn't need Capital.
				// Doesn't need ArchivedAt because is not archived.
				// Doesn't need DeletedAt because is not deleted.
				CreatedAt: executionTime,
				UpdatedAt: executionTime,
			},
			Children: []account.Record{
				{
					// Doesn't need ID because is a new record.
					// ParentID will be added later after the creation of its corresponding account.
					Kind:        account.ExternalIncome,
					Currency:    currency.EUR,
					Name:        "Freelancing",
					Description: nullable.New("Hustling"),
					Color:       "#eb8934",
					Icon:        icon.Base,
					// Doesn't need Capital.
					ArchivedAt: nullable.New(executionTime),
					// Doesn't need DeletedAt because is not deleted.
					CreatedAt: executionTime,
					UpdatedAt: executionTime,
				},
				{
					// Doesn't need ID because is a new record.
					// ParentID will be added later after the creation of its corresponding account.
					Kind:        account.ExternalIncome,
					Currency:    currency.EUR,
					Name:        "Day Job",
					Description: nullable.New("Grinding"),
					Color:       "#eb8934",
					Icon:        icon.Base,
					// Doesn't need Capital.
					// Doesn't need ArchivedAt because is not archived.
					// Doesn't need DeletedAt because is not deleted.
					CreatedAt: executionTime,
					UpdatedAt: executionTime,
				},
				{
					// Doesn't need ID because is a new record.
					// ParentID will be added later after the creation of its corresponding account.
					Kind:        account.ExternalIncome,
					Currency:    currency.EUR,
					Name:        "Teaching",
					Description: nullable.New("Side Hustle"),
					Color:       "#eb8934",
					Icon:        icon.Base,
					// Doesn't need Capital.
					// Doesn't need ArchivedAt because is not archived.
					// Doesn't need DeletedAt because is not deleted.
					CreatedAt: executionTime,
					UpdatedAt: executionTime,
				},
			},
		},
	}

	accounts, err := createAccountWithChildrenAndNoHistory(ctx, tx, accounts...)
	if err != nil {
		return accounts, errors.Join(
			fmt.Errorf("failed to seed external income accounts"),
			err,
		)
	}

	return accounts, nil
}

func createExternalExpenseAccounts(
	ctx context.Context,
	tx pgx.Tx,
	executionTime time.Time,
) ([]accountWithChildrenAndNoHistory, error) {
	accounts := []accountWithChildrenAndNoHistory{
		{
			Account: account.Record{
				// Doesn't need ID because is a new record.
				// Doesn't need ParentID because is a parent record.
				Kind:        account.ExternalExpense,
				Currency:    currency.EUR,
				Name:        "Market",
				Description: nullable.New("I need to survive"),
				Color:       "#34ebae",
				Icon:        icon.Base,
				// Doesn't need Capital.
				// Doesn't need ArchivedAt because is not archived.
				// Doesn't need DeletedAt because is not deleted.
				CreatedAt: executionTime,
				UpdatedAt: executionTime,
			},
			Children: []account.Record{
				{
					// Doesn't need ID because is a new record.
					// ParentID will be added later after the creation of its corresponding account.
					Kind:        account.ExternalExpense,
					Currency:    currency.EUR,
					Name:        "Gardening supplies",
					Description: nullable.New("My ADHD demands to be fed dopamine"),
					Color:       "#34ebae",
					Icon:        icon.Base,
					// Doesn't need Capital.
					ArchivedAt: nullable.New(executionTime),
					// Doesn't need DeletedAt because is not deleted.
					CreatedAt: executionTime,
					UpdatedAt: executionTime,
				},
				{
					// Doesn't need ID because is a new record.
					// ParentID will be added later after the creation of its corresponding account.
					Kind:        account.ExternalExpense,
					Currency:    currency.EUR,
					Name:        "Food",
					Description: nullable.New("Fuel for my body"),
					Color:       "#34ebae",
					Icon:        icon.Base,
					// Doesn't need Capital.
					// Doesn't need ArchivedAt because is not archived.
					// Doesn't need DeletedAt because is not deleted.
					CreatedAt: executionTime,
					UpdatedAt: executionTime,
				},
				{
					// Doesn't need ID because is a new record.
					// ParentID will be added later after the creation of its corresponding account.
					Kind:     account.ExternalExpense,
					Currency: currency.EUR,
					Name:     "Fruit Shop",
					// Doesn't need Description because it won't have.
					Color: "#34ebae",
					Icon:  icon.Base,
					// Doesn't need Capital.
					// Doesn't need ArchivedAt because is not archived.
					// Doesn't need DeletedAt because is not deleted.
					CreatedAt: executionTime,
					UpdatedAt: executionTime,
				},
			},
		},
		{
			Account: account.Record{
				// Doesn't need ID because is a new record.
				// Doesn't need ParentID because is a parent record.
				Kind:     account.ExternalExpense,
				Currency: currency.EUR,
				Name:     "Transport",
				// Doesn't need Description because it won't have.
				Color: "#e5eb34",
				Icon:  icon.Base,
				// Doesn't need Capital.
				// Doesn't need ArchivedAt because is not archived.
				// Doesn't need DeletedAt because is not deleted.
				CreatedAt: executionTime,
				UpdatedAt: executionTime,
			},
			Children: []account.Record{},
		},
	}

	accounts, err := createAccountWithChildrenAndNoHistory(ctx, tx, accounts...)
	if err != nil {
		return accounts, errors.Join(
			fmt.Errorf("failed to seed external income accounts"),
			err,
		)
	}

	return accounts, nil
}

func createAccountsWithHistory(
	ctx context.Context,
	tx pgx.Tx,
	accounts ...accountWithHistory,
) ([]accountWithHistory, error) {
	for i := 0; i < len(accounts); i++ {
		var (
			acc  = accounts[i].Account
			hist = accounts[i].History

			withHistory = accounts[i].WithHistory
			capital     = accounts[i].Capital
			historyAt   = accounts[i].HistoryAt
		)

		acc, err := createAccount(ctx, tx, acc)
		if err != nil {
			return accounts, err
		}

		hist.ParentID = nullable.New(acc.ID)
		hist.Currency = acc.Currency

		hist, err = createAccount(ctx, tx, hist)
		if err != nil {
			return accounts, err
		}

		if withHistory && capital != 0 {
			err = createTransaction(
				ctx,
				tx,
				transaction.Record{
					SourceID:     hist.ID,
					TargetID:     acc.ID,
					SourceAmount: capital,
					TargetAmount: capital,
					Notes:        nullable.New("This transaction was created automatically by the system. DO NOT MODIFY"),
					IssuedAt:     historyAt,
					ExecutedAt:   nullable.New(historyAt),
					CreatedAt:    acc.CreatedAt,
					UpdatedAt:    acc.UpdatedAt,
				},
			)
			if err != nil {
				return accounts, errors.Join(
					fmt.Errorf("failed to create history transaction"),
					err,
				)
			}
		}

		accounts[i].Account = acc
		accounts[i].History = hist
	}

	return accounts, nil
}

func createAccountWithChildrenAndNoHistory(
	ctx context.Context,
	tx pgx.Tx,
	accounts ...accountWithChildrenAndNoHistory,
) ([]accountWithChildrenAndNoHistory, error) {
	for i := 0; i < len(accounts); i++ {
		var (
			acc      = accounts[i].Account
			children = accounts[i].Children
		)

		acc, err := createAccount(ctx, tx, acc)
		if err != nil {
			return accounts, err
		}

		for j := 0; j < len(children); j++ {
			child := children[j]

			child.ParentID = nullable.New(acc.ID)
			child.Currency = acc.Currency
			child.Color = acc.Color

			child, err = createAccount(ctx, tx, child)
			if err != nil {
				return accounts, err
			}

			children[j] = child
		}

		accounts[i].Account = acc
		accounts[i].Children = children
	}

	return accounts, nil
}

func createAccount(ctx context.Context, tx pgx.Tx, acc account.Record) (account.Record, error) {
	err := tx.QueryRow(
		ctx,
		insertQuery,
		acc.ParentID,
		acc.Kind,
		acc.Currency,
		acc.Name,
		acc.Description,
		acc.Color,
		acc.Icon,
		acc.Capital,
		acc.ArchivedAt,
		acc.DeletedAt,
		acc.CreatedAt,
		acc.UpdatedAt,
	).Scan(&acc.ID)

	return acc, err
}

func createTransaction(ctx context.Context, tx pgx.Tx, tr transaction.Record) error {
	if tr.SourceAmount < 0 {
		oldSourceID := tr.SourceID

		tr.SourceID = tr.TargetID
		tr.TargetID = oldSourceID

		tr.SourceAmount = -tr.SourceAmount
		tr.TargetAmount = -tr.TargetAmount
	}

	results, err := tx.Exec(
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
	)
	if err == nil && results.RowsAffected() == 0 {
		err = fmt.Errorf("failed to transaction")
	}

	return err
}

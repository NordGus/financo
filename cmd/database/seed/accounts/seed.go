package accounts

import (
	"context"
	"database/sql"
	"errors"
	"financo/lib/nullable"
	"financo/models/account"
	"financo/models/transaction"
	"fmt"
	"log"
	"time"
)

type AccountRecord struct {
	Account  account.Record
	Children map[string]account.Record
}

func SeedAccounts(ctx context.Context, conn *sql.Conn, timestamp time.Time) (map[string]AccountRecord, error) {
	var (
		out           = make(map[string]AccountRecord, 10)
		tSummary uint = 0
		summary       = make(map[account.Kind]uint, 8)
	)

	log.Println("\tseeding accounts")

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return out, errors.Join(errors.New("accounts: failed to seed"), err)
	}
	defer tx.Rollback()

	for i := 0; i < len(accounts); i++ {
		key := accounts[i].MapKey

		record, sum, tc, err := seed(ctx, tx, accounts[i], timestamp)
		if err != nil {
			return out, errors.Join(fmt.Errorf("accounts: failed to seed %s", key), err)
		}

		out[key] = record

		for kind, count := range sum {
			summary[kind] += count
		}

		tSummary += tc
	}

	err = tx.Commit()
	if err != nil {
		return out, errors.Join(errors.New("accounts: failed to seed"), err)
	}

	// printing summary
	for kind, count := range summary {
		log.Printf("\t\t%d %v accounts seeded\n", count, kind)
	}

	log.Printf("\t\t%d historic transactions seeded\n", tSummary)

	return out, nil
}

func seed(
	ctx context.Context,
	tx *sql.Tx,
	s accountSeed,
	timestamp time.Time,
) (AccountRecord, map[account.Kind]uint, uint, error) {
	var (
		tc        uint = 0
		ac             = make(map[account.Kind]uint, 3)
		children       = make(map[string]account.Record, 0)
		historyAt      = s.HistoryAt(timestamp)
		history        = historyTemplate
		parent         = s.Account
		pKey           = s.MapKey
	)

	parent.ArchivedAt = s.ArchivedAt(timestamp)
	parent.DeletedAt = s.DeletedAt(timestamp)
	parent.CreatedAt = timestamp
	parent.UpdatedAt = timestamp

	parent, err := createAccount(ctx, parent, tx)
	if err != nil {
		return AccountRecord{}, ac, tc, errors.Join(fmt.Errorf("accounts: failed to seed %s", pKey), err)
	}

	ac[parent.Kind] += 1

	if !account.IsExternal(parent.Kind) {
		history.ParentID = nullable.New(parent.ID)
		history.Currency = parent.Currency
		history.ArchivedAt = parent.ArchivedAt
		history.DeletedAt = parent.DeletedAt
		history.CreatedAt = timestamp
		history.UpdatedAt = timestamp

		history, err = createAccount(ctx, history, tx)
		if err != nil {
			return AccountRecord{},
				ac,
				tc,
				errors.Join(fmt.Errorf("accounts: failed to seed %s history", pKey), err)
		}

		ac[history.Kind] += 1
	}

	if !account.IsExternal(parent.Kind) && historyAt.Valid {
		tr := historyTransactionTemplate

		tr.SourceID = history.ID
		tr.TargetID = parent.ID
		tr.SourceAmount = s.HistoryCapital
		tr.TargetAmount = s.HistoryCapital
		tr.IssuedAt = historyAt.Val
		tr.ExecutedAt = historyAt
		tr.CreatedAt = timestamp
		tr.UpdatedAt = timestamp

		if tr.SourceAmount < 0 {
			tr.SourceID, tr.TargetID = tr.TargetID, tr.SourceID
			tr.SourceAmount = -tr.SourceAmount
			tr.TargetAmount = -tr.TargetAmount
		}

		tr, err = createTransaction(ctx, tr, tx)
		if err != nil {
			return AccountRecord{},
				ac,
				tc,
				errors.Join(fmt.Errorf("accounts: failed to seed %s history transaction", pKey), err)
		}

		tc += 1
	}

	for i := 0; i < len(s.Children); i++ {
		var (
			child = s.Children[i].Account
			key   = s.Children[i].MapKey
		)

		child.ParentID = nullable.New(parent.ID)
		child.Currency = parent.Currency
		child.ArchivedAt = s.Children[i].ArchivedAt(timestamp)
		child.DeletedAt = s.Children[i].DeletedAt(timestamp)
		child.CreatedAt = timestamp
		child.UpdatedAt = timestamp

		child, err = createAccount(ctx, child, tx)
		if err != nil {
			return AccountRecord{},
				ac,
				tc,
				errors.Join(fmt.Errorf("accounts: failed to seed %s child %s", pKey, key), err)
		}

		ac[child.Kind] += 1
		children[key] = child
	}

	rec := AccountRecord{
		Account:  parent,
		Children: children,
	}

	return rec, ac, tc, nil
}

func createAccount(ctx context.Context, record account.Record, tx *sql.Tx) (account.Record, error) {
	err := tx.QueryRowContext(
		ctx,
		`
		INSERT INTO
			accounts(
				parent_id,
				kind,
				currency,
				name,
				description,
				color,
				icon,
				capital,
				archived_at,
				deleted_at,
				created_at,
				updated_at
			)
		VALUES
			($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		RETURNING id
		`,
		record.ParentID,
		record.Kind,
		record.Currency,
		record.Name,
		record.Description,
		record.Color,
		record.Icon,
		record.Capital,
		record.ArchivedAt,
		record.DeletedAt,
		record.CreatedAt,
		record.UpdatedAt,
	).Scan(&record.ID)

	return record, err
}

func createTransaction(ctx context.Context, tr transaction.Record, tx *sql.Tx) (transaction.Record, error) {
	err := tx.QueryRowContext(
		ctx,
		`
		INSERT INTO
			transactions(
				source_id,
				target_id,
				source_amount,
				target_amount,
				notes,
				issued_at,
				executed_at,
				created_at,
				updated_at
			)
		VALUES
			($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id
		`,
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

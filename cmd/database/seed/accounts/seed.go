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
	"slices"
	"time"
)

type dynamicData struct {
	id      int64
	count   int64
	balance int64
}

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

	for i := 0; i < len(accounts); i++ {
		key := accounts[i].MapKey

		record, sum, tc, err := seed(ctx, tx, accounts[i], timestamp)
		if err != nil {
			_ = tx.Rollback()
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
		_ = tx.Rollback()
		return out, errors.Join(errors.New("accounts: failed to seed"), err)
	}

	// printing summary
	for kind, count := range summary {
		log.Printf("\t\t%d %v accounts seeded\n", count, kind)
	}

	log.Printf("\t\t%d historic transactions seeded\n", tSummary)

	return out, nil
}

func SeedDynamicData(ctx context.Context, conn *sql.Conn, timestamp time.Time) error {
	var (
		records = make([]account.Record, 0, 10)
		ids     = make([]int64, 0, 10)
		updates = make([]dynamicData, 0, 10)
	)

	log.Println("\tseeding accounts transactions count")

	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return errors.Join(errors.New("accounts: failed to seed transaction count"), err)
	}

	rows, err := tx.QueryContext(
		ctx,
		`
		SELECT
			acc.id,
			COUNT(tr.id) as trs,
			SUM(
				CASE
					WHEN tr.source_id = acc.id THEN - tr.source_amount
					ELSE tr.target_amount
				END
			) AS balance
		FROM accounts acc
		INNER JOIN transactions tr ON (
			tr.source_id = acc.id
			OR tr.target_id = acc.id
		)
		WHERE
			tr.deleted_at IS NULL
		GROUP BY
			acc.id
		`,
	)
	if err != nil {
		_ = tx.Rollback()
		return errors.Join(errors.New("accounts: failed to seed transaction count, retrieving count"), err)
	}
	defer rows.Close()

	for rows.Next() {
		var r dynamicData

		err = rows.Scan(&r.id, &r.count, &r.balance)
		if err != nil {
			_ = tx.Rollback()
			return errors.Join(errors.New("accounts: failed to seed transaction count"), err)
		}

		updates = append(updates, r)
		ids = append(ids, r.id)
	}

	rows.Close()

	rows, err = tx.QueryContext(
		ctx,
		`
		SELECT
			acc.id,
			acc.dynamic_data
		FROM accounts acc
		WHERE
			acc.deleted_at IS NULL AND
			acc.id = ANY ($1)
		`,
		ids,
	)
	if err != nil {
		return errors.Join(errors.New("accounts: failed to seed transaction count, retrieving accounts"), err)
	}
	defer rows.Close()

	for rows.Next() {
		var r account.Record

		err = rows.Scan(
			&r.ID,
			&r.DynamicData,
		)
		if err != nil {
			return errors.Join(errors.New("accounts: failed to seed transaction count, scanning accounts"), err)
		}

		i := slices.IndexFunc(updates, func(a dynamicData) bool {
			return a.id == r.ID
		})

		r.DynamicData.Balance = updates[i].balance
		r.DynamicData.Transactions = updates[i].count

		records = append(records, r)
	}

	for i := 0; i < len(records); i++ {
		var id int64

		err := tx.QueryRowContext(
			ctx,
			`
			UPDATE accounts
			SET dynamic_data = $2
			WHERE id = $1
			RETURNING id
			`,
			records[i].ID,
			records[i].DynamicData,
		).Scan(&id)
		if err != nil {
			_ = tx.Rollback()
			return errors.Join(errors.New("accounts: failed to seed transaction count, updating"), err)
		}
	}

	err = tx.Commit()
	if err != nil {
		_ = tx.Rollback()
		return err
	}

	log.Printf("\t\t%d accounts transaction count seeded\n", len(updates))

	return nil
}

func seed(
	ctx context.Context,
	tx *sql.Tx,
	s accountSeed,
	timestamp time.Time,
) (AccountRecord, map[account.Kind]uint, uint, error) {
	var (
		tc       uint = 0
		ac            = make(map[account.Kind]uint, 3)
		children      = make(map[string]account.Record, 0)
		history       = historyTemplate
		parent        = s.Account
		pKey          = s.MapKey
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

	if !account.IsExternal(parent.Kind) {
		tr := historyTransactionTemplate

		tr.SourceID = history.ID
		tr.TargetID = parent.ID
		tr.SourceAmount = s.Account.DynamicData.History.Balance.Val
		tr.TargetAmount = s.Account.DynamicData.History.Balance.Val
		tr.IssuedAt = s.Account.DynamicData.History.At.Val
		tr.ExecutedAt = s.Account.DynamicData.History.At
		tr.CreatedAt = timestamp
		tr.UpdatedAt = timestamp

		if tr.SourceAmount < 0 {
			tr.SourceID, tr.TargetID = tr.TargetID, tr.SourceID
			tr.SourceAmount = -tr.SourceAmount
			tr.TargetAmount = -tr.TargetAmount
		}

		if !s.Account.DynamicData.History.At.Valid {
			tr.DeletedAt = nullable.New(timestamp)
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
				updated_at,
				dynamic_data
			)
		VALUES
			($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
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
		record.DynamicData,
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

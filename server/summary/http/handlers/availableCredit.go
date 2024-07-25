package handlers

import (
	"encoding/json"
	"financo/server/types/generic/context_key"
	"financo/server/types/records/account"
	"financo/server/types/shared/currency"
	"log"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
)

const (
	creditsToCreditQuery = `
SELECT
	acc.id,
	acc.currency,
	SUM(COALESCE(tr.target_amount, 0)) AS amount,
	MAX(acc.capital) AS capital
FROM transactions tr
    INNER JOIN accounts acc ON acc.id = tr.target_id
WHERE
    acc.kind = ANY ($1)
    AND tr.deleted_at IS NULL
    AND acc.deleted_at IS NULL
    AND acc.archived_at IS NULL
    AND tr.executed_at IS NOT NULL
    AND tr.executed_at <= NOW()
GROUP BY
    acc.id,
    acc.currency
ORDER BY acc.currency, acc.id
	`
	debitsToCreditQuery = `
SELECT
	acc.id,
	acc.currency,
	SUM(COALESCE(- tr.source_amount, 0)) AS amount,
	MAX(acc.capital) AS capital
FROM transactions tr
    INNER JOIN accounts acc ON acc.id = tr.source_id
WHERE
    acc.kind = ANY ($1)
    AND tr.deleted_at IS NULL
    AND acc.deleted_at IS NULL
    AND acc.archived_at IS NULL
    AND tr.issued_at <= NOW()
GROUP BY
    acc.id,
    acc.currency
ORDER BY acc.currency, acc.id;
	`
)

type accountSummary struct {
	ID       int64
	Currency string
	Amount   int64
	Capital  int64
}

func AvailableCredit(w http.ResponseWriter, r *http.Request) {
	var (
		ctx       = r.Context()
		kinds     = []account.Kind{account.DebtCredit}
		summaries = make([]accountSummary, 0, 10)
		results   = make([]Balance, 0, 10)
	)
	db, ok := ctx.Value(context_key.DB).(*pgxpool.Conn)
	if !ok {
		log.Println("failed to retrieved database connection")
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	credits, err := db.Query(ctx, creditsToCreditQuery, kinds)
	if err != nil {
		log.Println("failed query", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	for credits.Next() {
		blc := accountSummary{}

		err = credits.Scan(
			&blc.ID,
			&blc.Currency,
			&blc.Amount,
			&blc.Capital,
		)
		if err != nil {
			credits.Close()
			log.Println("failed scan", err)
			http.Error(
				w,
				http.StatusText(http.StatusInternalServerError),
				http.StatusInternalServerError,
			)
			return
		}

		summaries = append(summaries, blc)
	}
	credits.Close()

	debits, err := db.Query(ctx, debitsToCreditQuery, kinds)
	if err != nil {
		log.Println("failed query", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	for debits.Next() {
		var (
			added = false
			blc   = accountSummary{}
		)

		err = debits.Scan(
			&blc.ID,
			&blc.Currency,
			&blc.Amount,
			&blc.Capital,
		)
		if err != nil {
			debits.Close()
			log.Println("failed scan", err)
			http.Error(
				w,
				http.StatusText(http.StatusInternalServerError),
				http.StatusInternalServerError,
			)
			return
		}

		for i := 0; i < len(summaries); i++ {
			if summaries[i].ID == blc.ID {
				summaries[i].Amount += blc.Amount
				added = true
				break
			}
		}

		if !added {
			summaries = append(summaries, blc)
		}
	}
	debits.Close()

	for i := 0; i < len(summaries); i++ {
		var (
			added   = false
			summary = summaries[i]
		)

		for j := 0; j < len(results); i++ {
			if results[j].Currency == currency.Type(summary.Currency) {
				results[j].Amount += summary.Capital + summary.Amount
				added = true
				break
			}
		}

		if !added {
			results = append(results, Balance{
				Currency: currency.Type(summary.Currency),
				Amount:   summary.Capital + summary.Amount,
			})
		}
	}

	response, err := json.Marshal(results)
	if err != nil {
		log.Println("failed json Marshal", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	_, err = w.Write(response)
	if err != nil {
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Add("Content-Type", "application/json")
}

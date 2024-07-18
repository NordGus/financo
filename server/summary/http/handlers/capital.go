package handlers

import (
	"encoding/json"
	"financo/server/types/generic/context_key"
	"financo/server/types/records/account"
	"financo/server/types/shared/currency"
	"log"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

const (
	creditsQuery = `
SELECT acc.currency, SUM(tr.target_amount)
FROM transactions tr
    INNER JOIN accounts acc ON acc.id = tr.target_id
WHERE
    acc.kind = ANY ($1)
    AND tr.deleted_at IS NULL
    AND acc.deleted_at IS NULL
    AND tr.executed_at IS NOT NULL
    AND tr.executed_at <= $2
GROUP BY
    acc.currency
ORDER BY acc.currency
`
	debitsQuery = `
SELECT acc.currency, SUM(- tr.source_amount)
FROM transactions tr
    INNER JOIN accounts acc ON acc.id = tr.source_id
WHERE
    acc.kind = ANY ($1)
    AND tr.deleted_at IS NULL
    AND acc.deleted_at IS NULL
    AND tr.issued_at <= $2
GROUP BY
    acc.currency
ORDER BY acc.currency
`
)

type Balance struct {
	Currency currency.Type `json:"currency"`
	Amount   int64         `json:"amount"`
}

func Capital(w http.ResponseWriter, r *http.Request) {
	var (
		ctx     = r.Context()
		now     = time.Now()
		kinds   = []account.Kind{account.CapitalNormal, account.CapitalSavings}
		results = make([]Balance, 0, 10)
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

	credits, err := db.Query(ctx, creditsQuery, kinds, now)
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
		blc := Balance{}

		err = credits.Scan(&blc.Currency, &blc.Amount)
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

		results = append(results, blc)
	}
	credits.Close()

	debits, err := db.Query(ctx, debitsQuery, kinds, now)
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
			blc   = Balance{}
		)

		err = debits.Scan(&blc.Currency, &blc.Amount)
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

		for i := 0; i < len(results); i++ {
			if results[i].Currency == blc.Currency {
				results[i].Amount += blc.Amount
				added = true
				break
			}
		}

		if !added {
			results = append(results, blc)
		}
	}
	debits.Close()

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

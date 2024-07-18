package handlers

import (
	"encoding/json"
	"financo/server/types/generic/context_key"
	"financo/server/types/records/account"
	"log"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func Debts(w http.ResponseWriter, r *http.Request) {
	var (
		ctx     = r.Context()
		now     = time.Now()
		kinds   = []account.Kind{account.DebtLoan, account.DebtPersonal, account.DebtCredit}
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

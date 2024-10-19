package for_account

import (
	"encoding/json"
	"financo/server/transactions/queries/account_pending_query"
	"financo/server/types/generic/nullable"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
)

func pending(w http.ResponseWriter, r *http.Request) {
	var (
		accounts   = make([]int64, 0, 10)
		categories = make([]int64, 0, 10)

		id   int64
		from nullable.Type[time.Time]
		to   nullable.Type[time.Time]
	)

	id, err := strconv.ParseInt(chi.URLParam(r, "accountID"), 10, 64)
	if err != nil {
		log.Println("failed to parsed id", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	if r.URL.Query().Has(executedFromKey) {
		raw, err := time.Parse(time.RFC3339, r.URL.Query().Get(executedFromKey))
		if err != nil {
			log.Println("failed to parsed from", err)
			http.Error(
				w,
				http.StatusText(http.StatusInternalServerError),
				http.StatusInternalServerError,
			)
			return
		}

		from = nullable.New(raw)
	}

	if r.URL.Query().Has(executedUntilKey) {
		raw, err := time.Parse(time.RFC3339, r.URL.Query().Get(executedUntilKey))
		if err != nil {
			log.Println("failed to parsed to", err)
			http.Error(
				w,
				http.StatusText(http.StatusInternalServerError),
				http.StatusInternalServerError,
			)
			return
		}

		to = nullable.New(raw)
	}

	if r.URL.Query().Has(accountKey) {
		raw := strings.Split(r.URL.Query().Get(accountKey), ",")

		for i := 0; i < len(raw); i++ {
			if raw[i] == "" {
				continue
			}

			parsed, err := strconv.ParseInt(raw[i], 10, 64)
			if err != nil {
				log.Println("failed to parsed id", err)
				http.Error(
					w,
					http.StatusText(http.StatusInternalServerError),
					http.StatusInternalServerError,
				)
				return
			}

			accounts = append(accounts, parsed)
		}
	}

	if r.URL.Query().Has(categoryKey) {
		raw := strings.Split(r.URL.Query().Get(categoryKey), ",")

		for i := 0; i < len(raw); i++ {
			if raw[i] == "" {
				continue
			}

			parsed, err := strconv.ParseInt(raw[i], 10, 64)
			if err != nil {
				log.Println("failed to parsed id", err)
				http.Error(
					w,
					http.StatusText(http.StatusInternalServerError),
					http.StatusInternalServerError,
				)
				return
			}

			categories = append(categories, parsed)
		}
	}

	res, err := account_pending_query.New(id, from, to, accounts, categories).Find(r.Context())
	if err != nil {
		log.Println("query failed", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	response, err := json.Marshal(res)
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

	w.Header().Add("Content-Type", "application/json")
}
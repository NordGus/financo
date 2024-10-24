package transactions

import (
	"encoding/json"
	"financo/lib/nullable"
	"financo/server/transactions/queries/list_query"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"
)

func index(w http.ResponseWriter, r *http.Request) {
	var (
		accounts   = make([]int64, 0, 10)
		categories = make([]int64, 0, 10)

		from nullable.Type[time.Time]
		to   nullable.Type[time.Time]
	)

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

	res, err := list_query.New(from, to, accounts, categories).Find(r.Context())
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

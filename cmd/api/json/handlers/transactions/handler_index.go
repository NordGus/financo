package transactions

import (
	"encoding/json"
	"financo/core/scope_transactions/application/queries/executed_query"
	"financo/core/scope_transactions/domain/requests"
	"financo/core/scope_transactions/infrastructure/executed_transactions_repository"
	"financo/lib/nullable"
	"financo/services/postgresql_database"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"
)

func index(w http.ResponseWriter, r *http.Request) {
	var (
		req = requests.Executed{
			AccountIDs:  make([]int64, 0, 10),
			CategoryIDs: make([]int64, 0, 10),
		}
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

		req.From = nullable.New(raw)
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

		req.To = nullable.New(raw)
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

			req.AccountIDs = append(req.AccountIDs, parsed)
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

			req.CategoryIDs = append(req.CategoryIDs, parsed)
		}
	}

	repo := executed_transactions_repository.New(postgresql_database.New())

	res, err := executed_query.New(req, repo).Find(r.Context())
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

package for_account

import (
	"encoding/json"
	"financo/core/scope_graphs/application/daily_balance_for_account_query"
	"financo/core/scope_graphs/domain/requests"
	"financo/core/scope_graphs/infrastructure/daily_balance_for_account_repository"
	"financo/lib/nullable"
	"financo/services/postgresql_database"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
)

func Daily(w http.ResponseWriter, r *http.Request) {
	var (
		now    = time.Now().UTC()
		offset = -90
		req    = requests.DailyBalanceForAccount{
			From: nullable.New(now.AddDate(0, 0, offset)),
			To:   nullable.New(now),
		}
	)

	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		log.Println("failed to parse account id", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	req.ID = id

	res, err := daily_balance_for_account_query.New(
		req,
		daily_balance_for_account_repository.NewPostgreSQL(postgresql_database.New()),
	).Find(r.Context())
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

	w.WriteHeader(http.StatusOK)
	w.Header().Add("Content-Type", "application/json")
}

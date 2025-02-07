package executed_handler

import (
	"encoding/json"
	"financo/core/scope_transactions/application/queries/executed_query"
	"financo/core/scope_transactions/domain/requests"
	"financo/core/scope_transactions/infrastructure/repositories/transactions_repository"
	"financo/lib/nullable"
	"financo/services/postgresql_database"
	"log"
	"net/http"
	"strconv"
	"time"
)

func HandlerFunc(w http.ResponseWriter, r *http.Request) {
	var (
		db           = postgresql_database.New()
		transactions = transactions_repository.NewPostgreSQL(db)

		req requests.Executed
		err error
	)

	req.From, err = parseDate(r, "from")
	if err != nil {
		log.Println("failed to parsed from", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	req.To, err = parseDate(r, "to")
	if err != nil {
		log.Println("failed to parsed to", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	req.AccountIDs, err = parseIds(r, "accounts")
	if err != nil {
		log.Println("failed to parsed accounts", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	req.CategoryIDs, err = parseIds(r, "categories")
	if err != nil {
		log.Println("failed to parsed id", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	res, err := executed_query.New(req, transactions).Find(r.Context())
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

func parseDate(r *http.Request, param string) (nullable.Type[time.Time], error) {
	var out nullable.Type[time.Time]

	if !r.URL.Query().Has(param) {
		return out, nil
	}

	raw, err := time.Parse(time.DateOnly, r.URL.Query().Get(param))

	return nullable.New(raw), err
}

func parseIds(r *http.Request, param string) ([]int64, error) {
	out := make([]int64, 0, 10)

	if !r.URL.Query().Has(param) {
		return out, nil
	}

	raw := r.URL.Query()[param]

	for i := 0; i < len(raw); i++ {
		if raw[i] == "" {
			continue
		}

		parsed, err := strconv.ParseInt(raw[i], 10, 64)
		if err != nil {
			return out, err
		}

		out = append(out, parsed)
	}

	return out, nil
}

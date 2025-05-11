package pending_handler

import (
	"encoding/json"
	"financo/core/scope_transactions/application/queries/pending_query"
	"financo/core/scope_transactions/domain/requests"
	"financo/core/scope_transactions/infrastructure/repositories/transactions_repository"
	"financo/services/postgresql_database"
	"log"
	"net/http"
	"strconv"
	"strings"
)

func HandlerFunc(w http.ResponseWriter, r *http.Request) {
	var (
		db           = postgresql_database.New()
		transactions = transactions_repository.NewPostgreSQL(db)

		req requests.Pending
		err error
	)

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
		log.Println("failed to parsed categories", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	res, err := pending_query.New(req, transactions).Find(r.Context())
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

func parseIds(r *http.Request, param string) ([]int64, error) {
	out := make([]int64, 0, 10)

	if !r.URL.Query().Has(param) {
		return out, nil
	}

	raw := strings.Split(r.URL.Query().Get(param), ",")

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

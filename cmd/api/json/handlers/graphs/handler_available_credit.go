package graphs

import (
	"encoding/json"
	"financo/core/scope_graphs/application/available_credit_query"
	"financo/core/scope_graphs/domain/requests"
	"financo/core/scope_graphs/infrastructure/balance_for_kinds_repository"
	"financo/core/scope_graphs/infrastructure/credit_accounts_repository"
	"financo/services/postgresql_database"
	"log"
	"net/http"
)

func AvailableCredit(w http.ResponseWriter, r *http.Request) {
	var (
		db = postgresql_database.New()

		req requests.AvailableCredit
	)

	res, err := available_credit_query.New(
		req,
		credit_accounts_repository.NewPostgreSQL(db),
		balance_for_kinds_repository.NewPostgreSQL(db),
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

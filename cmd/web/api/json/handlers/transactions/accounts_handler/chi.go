package accounts_handler

import (
	"encoding/json"
	"financo/core/scope_transactions/application/queries/accounts_query"
	"financo/core/scope_transactions/domain/requests"
	"financo/core/scope_transactions/infrastructure/repositories/accounts_repository"
	"financo/services/postgresql_database"
	"log"
	"net/http"
)

func HandlerFunc(w http.ResponseWriter, r *http.Request) {
	var (
		db       = postgresql_database.New()
		accounts = accounts_repository.NewPostgreSQL(db)

		req requests.Accounts
		err error
	)

	res, err := accounts_query.New(req, accounts).Find(r.Context())
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

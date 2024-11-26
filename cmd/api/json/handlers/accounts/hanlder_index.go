package accounts

import (
	"encoding/json"
	"financo/core/scope_accounts/application/queries/list_query"
	"financo/core/scope_accounts/domain/requests"
	"financo/core/scope_accounts/infrastructure/repositories/accounts_repository"
	"financo/services/postgresql_database"
	"log"
	"net/http"
)

func index(w http.ResponseWriter, r *http.Request) {
	var (
		req = requests.List{}
		db  = postgresql_database.New()
	)

	repo := accounts_repository.NewPostgreSQL(db)

	res, err := list_query.New(req, repo).Find(r.Context())
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
		log.Println("failed to write response", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	w.Header().Add("Content-Type", "application/json")
}

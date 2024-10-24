package accounts

import (
	"encoding/json"
	"financo/core/domain/records/account"
	"financo/core/infrastructure/postgresql_database"
	"financo/core/scope_accounts/application/queries/preview_query"
	"financo/core/scope_accounts/domain/requests"
	"financo/core/scope_accounts/infrastructure/preview_account_repository"
	"financo/server/types/generic/nullable"
	"log"
	"net/http"
	"strings"
)

func index(w http.ResponseWriter, r *http.Request) {
	var (
		req = requests.Preview{
			Kinds: make([]account.Kind, 0, 7),
		}
	)

	for _, k := range strings.Split(r.URL.Query().Get("kind"), ",") {
		req.Kinds = append(req.Kinds, account.Kind(k))
	}

	if r.URL.Query().Get("archived") != "" {
		req.Archived = nullable.New(r.URL.Query().Get("archived") == "true")
	}

	repo := preview_account_repository.NewPostgreSQL(postgresql_database.New())

	res, err := preview_query.New(req, repo).Find(r.Context())
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

package list_handler

import (
	"encoding/json"
	"financo/core/infrastructure/http/utils/params"
	"financo/core/scope_accounts/application/queries/list_query"
	"financo/core/scope_accounts/domain/requests"
	"financo/core/scope_accounts/infrastructure/repositories/accounts_repository"
	"financo/services/postgresql_database"
	"log"
	"net/http"
)

func HandlerFunc(w http.ResponseWriter, r *http.Request) {
	var (
		db       = postgresql_database.New()
		accounts = accounts_repository.NewPostgreSQL(db)

		req requests.List
		err error
	)

	req.Archive, err = params.ParseNullableBoolean(r, "archived")
	if err != nil {
		log.Println("failed to parsed archived", err)
		http.Error(
			w,
			http.StatusText(http.StatusBadRequest),
			http.StatusBadRequest,
		)
		return
	}

	req.Kinds, err = params.ParseAccountKind(r, "kinds")
	if err != nil {
		log.Println("failed to parsed kinds", err)
		http.Error(
			w,
			http.StatusText(http.StatusBadRequest),
			http.StatusBadRequest,
		)
		return
	}

	req.Currencies, err = params.ParseCurrencies(r, "currencies")
	if err != nil {
		log.Println("failed to parsed kinds", err)
		http.Error(
			w,
			http.StatusText(http.StatusBadRequest),
			http.StatusBadRequest,
		)
		return
	}

	res, err := list_query.New(req, accounts).Find(r.Context())
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

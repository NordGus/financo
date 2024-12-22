package categories

import (
	"encoding/json"
	"financo/core/scope_categories/application/queries/list_query"
	"financo/core/scope_categories/domain/requests"
	"financo/core/scope_categories/infrastructure/repositories/categories_repository"
	"financo/services/postgresql_database"
	"log"
	"net/http"
)

func index(w http.ResponseWriter, r *http.Request) {
	var req requests.List

	res, err := list_query.New(
		req,
		categories_repository.NewPostgreSQL(postgresql_database.New()),
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

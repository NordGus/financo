package savings_goals

import (
	"encoding/json"
	"financo/core/scope_savings_goals/application/queries/active_query"
	"financo/core/scope_savings_goals/infrastructure/active_savings_goals_repository"
	"financo/services/postgresql_database"
	"log"
	"net/http"
)

func Active(w http.ResponseWriter, r *http.Request) {
	var (
		db = postgresql_database.New()
	)

	res, err := active_query.New(
		active_savings_goals_repository.NewPostgreSQL(db),
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

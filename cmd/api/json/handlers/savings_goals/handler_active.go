package savings_goals

import (
	"encoding/json"
	"financo/server/savings_goals/queries/list_active_query"
	"financo/server/services/postgres_database"
	"log"
	"net/http"
)

func active(w http.ResponseWriter, r *http.Request) {
	var (
		postgres = postgres_database.New()
	)

	res, err := list_active_query.New(postgres).Find(r.Context())
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

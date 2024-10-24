package my_journey

import (
	"encoding/json"
	"financo/server/my_journey/queries/list_achieved_query"
	"financo/services/postgresql_database"
	"log"
	"net/http"
)

func achievements(w http.ResponseWriter, r *http.Request) {
	var (
		postgres = postgresql_database.New()
	)

	res, err := list_achieved_query.New(postgres).Find(r.Context())
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

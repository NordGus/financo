// Package timeline_handler contains all the logic for handling http request
// to retrieve timeline data.
package timeline_handler

import (
	"encoding/json"
	"financo/core/scope_trophy_room/application/timeline_query"
	"financo/core/scope_trophy_room/domain/requests"
	"financo/core/scope_trophy_room/infrastructure/repositories/milestones_repository"
	"financo/services/postgresql_database"
	"log"
	"net/http"
)

func HandleFunc(w http.ResponseWriter, r *http.Request) {
	var (
		db           = postgresql_database.New()
		achievements = milestones_repository.NewPostgreSQL(db)

		req requests.Timeline
	)

	res, err := timeline_query.New(req, achievements).Find(r.Context())
	if err != nil {
		log.Println("command failed", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	resp, err := json.Marshal(&res)
	if err != nil {
		log.Println("failed json Marshal", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	_, err = w.Write(resp)
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

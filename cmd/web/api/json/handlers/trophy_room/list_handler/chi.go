// Package list_handler contains all the logic for handling http request
// to retrieve timeline data.
package list_handler

import (
	"encoding/json"
	"financo/core/scope_trophy_room/application/queries/list_query"
	"financo/core/scope_trophy_room/domain/requests"
	"financo/core/scope_trophy_room/infrastructure/repositories/milestones_repository"
	"financo/lib/nullable"
	"financo/models/achievement"
	"financo/services/postgresql_database"
	"log"
	"net/http"
	"strings"
	"time"
)

func HandleFunc(w http.ResponseWriter, r *http.Request) {
	var (
		db           = postgresql_database.New()
		achievements = milestones_repository.NewPostgreSQL(db)

		req requests.List
		err error
	)

	req.From, err = parseDate(r, "from")
	if err != nil {
		log.Println("failed to parsed from", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	req.To, err = parseDate(r, "to")
	if err != nil {
		log.Println("failed to parsed to", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	req.Kinds, err = parseKinds(r, "kinds")
	if err != nil {
		log.Println("failed to parsed kinds", err)
		http.Error(
			w,
			http.StatusText(http.StatusBadRequest),
			http.StatusBadRequest,
		)
		return
	}

	res, err := list_query.New(req, achievements).Find(r.Context())
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

func parseDate(r *http.Request, param string) (nullable.Type[time.Time], error) {
	var out nullable.Type[time.Time]

	if !r.URL.Query().Has(param) {
		return out, nil
	}

	raw, err := time.Parse(time.DateOnly, r.URL.Query().Get(param))

	return nullable.New(raw), err
}

func parseKinds(r *http.Request, param string) ([]achievement.Kind, error) {
	out := make([]achievement.Kind, 0, 4)

	if !r.URL.Query().Has(param) {
		return out, nil
	}

	raw := strings.Split(r.URL.Query().Get(param), ",")

	for i := range raw {
		if raw[i] == "" {
			continue
		}

		out = append(out, achievement.Kind(raw[i]))
	}

	return out, nil
}

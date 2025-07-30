package list_handler

import (
	"encoding/json"
	"financo/core/infrastructure/http/utils/params"
	"financo/core/scope_savings_goals/application/queries/list_query"
	"financo/core/scope_savings_goals/domain/requests"
	"financo/core/scope_savings_goals/infrastructure/repositories/savings_goals_repository"
	"financo/services/postgresql_database"
	"log"
	"net/http"
)

func HandlerFunc(w http.ResponseWriter, r *http.Request) {
	var (
		db    = postgresql_database.New()
		goals = savings_goals_repository.NewPostgreSQL(db)

		req requests.List
		err error
	)

	req.Currencies, err = params.ParseCurrencies(r, "currencies")
	if err != nil {
		log.Println("savings_goals: active_goals_for_handler: failed to parse currency", err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	res, err := list_query.New(req, goals).Find(r.Context())
	if err != nil {
		log.Println("savings_goals: active_goals_for_handler: command failed, reason:", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	b, err := json.Marshal(res)
	if err != nil {
		log.Println("savings_goals: active_goals_for_handler: command failed to marshal response, reason:", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	_, err = w.Write(b)
	if err != nil {
		log.Println("savings_goals: active_goals_for_handler: command failed to write response, reason:", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.Header().Add("Content-Type", "application/json")
}

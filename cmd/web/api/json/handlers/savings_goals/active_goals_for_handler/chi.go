package active_goals_for_handler

import (
	"encoding/json"
	"financo/core/scope_savings_goals/application/queries/active_query"
	"financo/core/scope_savings_goals/domain/requests"
	"financo/core/scope_savings_goals/infrastructure/repositories/savings_goals_repository"
	"financo/lib/currency"
	"financo/services/postgresql_database"
	"log"
	"net/http"
)

func HandlerFunc(w http.ResponseWriter, r *http.Request) {
	var (
		db    = postgresql_database.New()
		goals = savings_goals_repository.NewPostgreSQL(db)

		req requests.Active
	)

	curr, err := currency.New(r.URL.Query().Get("currency"))
	if err != nil {
		log.Println("savings_goals: active_goals_for_handler: failed to parse currency", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	req.Currency = curr

	res, err := active_query.New(req, goals).Find(r.Context())
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

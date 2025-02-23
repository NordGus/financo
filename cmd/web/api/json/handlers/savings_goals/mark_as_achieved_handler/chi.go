package mark_as_achieved_handler

import (
	"encoding/json"
	"financo/core/scope_savings_goals/application/commands/mark_as_achieved_command"
	"financo/core/scope_savings_goals/domain/requests"
	"financo/core/scope_savings_goals/infrastructure/repositories/savings_goals_repository"
	"financo/core/scope_savings_goals/infrastructure/repositories/update_repository"
	"financo/core/scope_savings_goals/infrastructure/services/message_broker"
	"financo/services/postgresql_database"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func HandlerFunc(w http.ResponseWriter, r *http.Request) {
	var (
		db     = postgresql_database.New()
		goals  = savings_goals_repository.NewPostgreSQL(db)
		update = update_repository.NewPostgreSQL(db)
		broker = message_broker.New()
		body   = r.Body

		req requests.MarkAsAchieved
	)
	defer body.Close()

	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		log.Println("savings_goals: mark_as_achieved_handler: failed to parse savings goal id", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	err = json.NewDecoder(body).Decode(&req)
	if err != nil {
		log.Println("savings_goals: mark_as_achieved_handler: unable to decode body, reason:", err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	if id != req.ID {
		log.Println("savings_goals: mark_as_achieved_handler: ids don't match")
		http.Error(w, http.StatusText(http.StatusNotAcceptable), http.StatusNotAcceptable)
		return
	}

	res, err := mark_as_achieved_command.New(req, goals, update, broker.MarkedAsAchieved()).Run(r.Context())
	if err != nil {
		log.Println("savings_goals: mark_as_achieved_handler: command failed, reason:", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	b, err := json.Marshal(res)
	if err != nil {
		log.Println("savings_goals: mark_as_achieved_handler: command failed to marshal response, reason:", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	_, err = w.Write(b)
	if err != nil {
		log.Println("savings_goals: mark_as_achieved_handler: command failed to write response, reason:", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.Header().Add("Content-Type", "application/json")
}

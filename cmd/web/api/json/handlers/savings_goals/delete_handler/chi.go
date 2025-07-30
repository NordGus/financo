package delete_handler

import (
	"encoding/json"
	"financo/core/scope_savings_goals/application/commands/delete_command"
	"financo/core/scope_savings_goals/domain/requests"
	"financo/core/scope_savings_goals/infrastructure/repositories/savings_goals"
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
		db      = postgresql_database.New()
		goals   = savings_goals.NewPostgreSQL(db)
		destroy = update_repository.NewPostgreSQL(db)
		broker  = message_broker.New()

		req requests.Delete
	)

	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		log.Println("savings_goals: delete_handler: failed to parse savings goal id", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	req.ID = id

	res, err := delete_command.New(req, goals, destroy, broker.Deleted()).Run(r.Context())
	if err != nil {
		log.Println("savings_goals: delete_handler: command failed, reason:", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	b, err := json.Marshal(res)
	if err != nil {
		log.Println("savings_goals: delete_handler: command failed to marshal response, reason:", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	_, err = w.Write(b)
	if err != nil {
		log.Println("savings_goals: delete_handler: command failed to write response, reason:", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.Header().Add("Content-Type", "application/json")
}

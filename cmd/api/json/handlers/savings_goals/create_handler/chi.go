package create_handler

import (
	"encoding/json"
	"financo/core/scope_savings_goals/application/commands/create_command"
	"financo/core/scope_savings_goals/domain/requests"
	"financo/core/scope_savings_goals/infrastructure/repositories/create_repository"
	"financo/core/scope_savings_goals/infrastructure/repositories/savings_goals_repository"
	"financo/core/scope_savings_goals/infrastructure/repositories/savings_repository"
	"financo/core/scope_savings_goals/infrastructure/services/message_broker"
	"financo/services/postgresql_database"
	"log"
	"net/http"
)

func Create(w http.ResponseWriter, r *http.Request) {
	var (
		db      = postgresql_database.New()
		savings = savings_repository.NewPostgreSQL(db)
		goals   = savings_goals_repository.NewPostgreSQL(db)
		create  = create_repository.NewPostgreSQL(db)
		body    = r.Body

		req requests.Create
	)
	defer body.Close()

	err := json.NewDecoder(body).Decode(&req)
	if err != nil {
		log.Println("savings_goals: create_handler: unable to decode body, reason:", err)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	broker, err := message_broker.Instance()
	if err != nil {
		log.Println("savings_goals: create_handler: failed to retrieve message broker, reason:", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	res, err := create_command.New(req, savings, goals, create, broker.Created()).Run(r.Context())
	if err != nil {
		log.Println("savings_goals: create_handler: command failed, reason:", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	b, err := json.Marshal(res)
	if err != nil {
		log.Println("savings_goals: create_handler: command failed to marshal response, reason:", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	_, err = w.Write(b)
	if err != nil {
		log.Println("savings_goals: create_handler: command failed to write response, reason:", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.Header().Add("Content-Type", "application/json")
}

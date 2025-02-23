package create_handler

import (
	"encoding/json"
	"financo/core/scope_accounts/application/commands/create_command"
	"financo/core/scope_accounts/domain/requests"
	"financo/core/scope_accounts/infrastructure/repositories/create_repository"
	"financo/core/scope_accounts/infrastructure/services/message_broker"
	"financo/services/postgresql_database"
	"log"
	"net/http"
)

func HandlerFunc(w http.ResponseWriter, r *http.Request) {
	var (
		db     = postgresql_database.New()
		create = create_repository.NewPostgreSQL(db)
		broker = message_broker.New()

		req requests.Create
	)

	body := r.Body
	defer func() {
		err := body.Close()
		if err != nil {
			log.Println("failed to close body", err)
		}
	}()

	err := json.NewDecoder(body).Decode(&req)
	if err != nil {
		log.Println("failed to decode body", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	res, err := create_command.New(req, create, broker.Created()).Run(r.Context())
	if err != nil {
		log.Println("command failed", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	resp, err := json.Marshal(&res)
	if err != nil {
		log.Println("failed json Marshal", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	_, err = w.Write(resp)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.Header().Add("Content-Type", "application/json")
}

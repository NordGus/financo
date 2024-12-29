package accounts

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

func create(w http.ResponseWriter, r *http.Request) {
	var (
		body = r.Body

		req requests.Create
	)
	defer body.Close()

	err := json.NewDecoder(body).Decode(&req)
	if err != nil {
		log.Println("failed to decode body", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	repo := create_repository.NewPostgreSQL(postgresql_database.New())

	broker, err := message_broker.Instance()
	if err != nil {
		log.Println("created broker uninitialized", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	res, err := create_command.New(req, repo, broker.Created()).Run(r.Context())
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

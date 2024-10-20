package accounts

import (
	"encoding/json"
	"financo/core/accounts/application/create_command"
	"financo/core/accounts/domain/requests"
	"financo/core/accounts/infrastructure/broker_handler"
	"financo/core/accounts/infrastructure/create_account_repository"
	"financo/server/services/postgres_database"
	"log"
	"net/http"
)

func create(w http.ResponseWriter, r *http.Request) {
	var req requests.Create

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

	repo := create_account_repository.NewPostgreSQL(postgres_database.New())

	broker, err := broker_handler.Instance()
	if err != nil {
		log.Println("created broker uninitialized", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	res, err := create_command.New(req, repo, broker.CreatedBroker()).Run(r.Context())
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

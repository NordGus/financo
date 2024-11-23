package transactions

import (
	"encoding/json"
	"financo/core/infrastructure/repositories/account_repository"
	"financo/core/scope_transactions/application/commands/create_command"
	"financo/core/scope_transactions/domain/requests"
	"financo/core/scope_transactions/infrastructure/broker_handler"
	"financo/core/scope_transactions/infrastructure/create_transaction_repository"
	"financo/core/scope_transactions/infrastructure/detailed_transaction_repository"
	"financo/services/postgresql_database"
	"log"
	"net/http"
)

func create(w http.ResponseWriter, r *http.Request) {
	var (
		db = postgresql_database.New()

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
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	broker, err := broker_handler.Instance()
	if err != nil {
		log.Println("failed to get broker handler instance", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	res, err := create_command.New(
		req,
		account_repository.NewPostgreSQL(db),
		create_transaction_repository.NewPostgreSQL(db),
		detailed_transaction_repository.NewPostgreSQL(db),
		broker.CreatedBroker(),
	).Run(r.Context())
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

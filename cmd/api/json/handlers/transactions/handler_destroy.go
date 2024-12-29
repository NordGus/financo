package transactions

import (
	"encoding/json"
	"financo/core/scope_transactions/application/commands/delete_command"
	"financo/core/scope_transactions/domain/requests"
	"financo/core/scope_transactions/infrastructure/repositories/delete_transaction_repository"
	"financo/core/scope_transactions/infrastructure/repositories/detailed_transaction_repository"
	"financo/core/scope_transactions/infrastructure/repositories/transaction_repository"
	"financo/core/scope_transactions/infrastructure/services/message_broker"
	"financo/services/postgresql_database"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func destroy(w http.ResponseWriter, r *http.Request) {
	var (
		db = postgresql_database.New()

		req requests.Delete
	)

	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		log.Println("failed to parse transaction id", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	req.ID = id

	broker, err := message_broker.Instance()
	if err != nil {
		log.Println("failed to acquire broker handler instance", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	res, err := delete_command.New(
		req,
		transaction_repository.NewPostgreSQL(db),
		delete_transaction_repository.NewPostgreSQL(db),
		detailed_transaction_repository.NewPostgreSQL(db),
		broker.Deleted(),
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

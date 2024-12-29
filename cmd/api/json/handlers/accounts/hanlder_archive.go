package accounts

import (
	"encoding/json"
	"financo/core/scope_accounts/application/commands/archive_command"
	"financo/core/scope_accounts/domain/requests"
	"financo/core/scope_accounts/infrastructure/repositories/accounts_repository"
	"financo/core/scope_accounts/infrastructure/repositories/archival_repository"
	"financo/core/scope_accounts/infrastructure/services/message_broker"
	"financo/services/postgresql_database"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func archive(w http.ResponseWriter, r *http.Request) {
	var (
		db = postgresql_database.New()

		req requests.Archive
	)

	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		log.Println("failed to parse account id", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	body := r.Body
	defer func() {
		err := body.Close()
		if err != nil {
			log.Println("failed to close body", err)
		}
	}()

	err = json.NewDecoder(body).Decode(&req)
	if err != nil {
		log.Println("failed to decode body", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	if id != req.ID {
		log.Println("ids don't match")
		http.Error(
			w,
			http.StatusText(http.StatusNotAcceptable),
			http.StatusNotAcceptable,
		)
		return
	}

	archivalRepo := archival_repository.NewPostgreSQL(db)
	repo := accounts_repository.NewPostgreSQL(db)

	broker, err := message_broker.Instance()
	if err != nil {
		log.Println("created broker uninitialized", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	res, err := archive_command.New(req, repo, archivalRepo, broker.Archived()).Run(r.Context())
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

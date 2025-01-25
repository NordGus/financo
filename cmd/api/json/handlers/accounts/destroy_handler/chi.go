package destroy_handler

import (
	"encoding/json"
	"financo/core/scope_accounts/application/commands/delete_command"
	"financo/core/scope_accounts/domain/requests"
	"financo/core/scope_accounts/infrastructure/repositories/delete_repository"
	"financo/core/scope_accounts/infrastructure/services/message_broker"
	"financo/services/postgresql_database"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func HandlerFunc(w http.ResponseWriter, r *http.Request) {
	var (
		db      = postgresql_database.New()
		destroy = delete_repository.NewPostgreSQL(db)

		req requests.Delete
	)

	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		log.Println("failed to parse account id", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	req.ID = id

	broker, err := message_broker.Instance()
	if err != nil {
		log.Println("broker uninitialized", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	res, err := delete_command.New(req, destroy, broker.Deleted()).Run(r.Context())
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

package savings_goals

import (
	"encoding/json"
	"financo/core/scope_savings_goals/application/commands/mark_as_achieved_command"
	"financo/core/scope_savings_goals/domain/requests"
	"financo/core/scope_savings_goals/infrastructure/repositories/active_savings_goals_for_currency_repository"
	"financo/core/scope_savings_goals/infrastructure/repositories/mark_as_achieved_repository"
	"financo/core/scope_savings_goals/infrastructure/repositories/reorder_repository"
	"financo/core/scope_savings_goals/infrastructure/repositories/savings_for_currency_repository"
	"financo/services/postgresql_database"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func MarkAsAchieved(w http.ResponseWriter, r *http.Request) {
	var (
		db = postgresql_database.New()

		req requests.MarkAsAchieved
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
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
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

	res, err := mark_as_achieved_command.New(
		req,
		mark_as_achieved_repository.NewPostgreSQL(db),
		active_savings_goals_for_currency_repository.NewPostgreSQL(db),
		savings_for_currency_repository.NewPostgreSQL(db),
		reorder_repository.NewPostgreSQL(db),
	).Run(r.Context())
	if err != nil {
		log.Println("query failed", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	response, err := json.Marshal(res)
	if err != nil {
		log.Println("failed json Marshal", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	_, err = w.Write(response)
	if err != nil {
		log.Println("failed to write response", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	w.Header().Add("Content-Type", "application/json")
}

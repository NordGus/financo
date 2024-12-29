package savings_goals

import (
	"encoding/json"
	"financo/core/scope_savings_goals/application/commands/update_command"
	"financo/core/scope_savings_goals/domain/requests"
	"financo/core/scope_savings_goals/infrastructure/repositories/active_savings_goals_for_currency_repository"
	"financo/core/scope_savings_goals/infrastructure/repositories/reorder_repository"
	"financo/core/scope_savings_goals/infrastructure/repositories/savings_for_currency_repository"
	"financo/core/scope_savings_goals/infrastructure/repositories/savings_goal_repository"
	"financo/services/postgresql_database"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func Update(w http.ResponseWriter, r *http.Request) {
	var (
		db = postgresql_database.New()

		req requests.Update
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

	res, err := update_command.New(
		req,
		savings_goal_repository.NewPostgreSQL(db),
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

package savings_goals

import (
	"encoding/json"
	"financo/core/scope_savings_goals/application/commands/delete_command"
	"financo/core/scope_savings_goals/domain/requests"
	"financo/core/scope_savings_goals/infrastructure/repositories/active_savings_goals_for_currency_repository"
	"financo/core/scope_savings_goals/infrastructure/repositories/delete_savings_goal_repository"
	"financo/core/scope_savings_goals/infrastructure/repositories/reorder_repository"
	"financo/core/scope_savings_goals/infrastructure/repositories/savings_for_currency_repository"
	"financo/services/postgresql_database"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func Destroy(w http.ResponseWriter, r *http.Request) {
	var (
		db = postgresql_database.New()

		req requests.Delete
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

	req.ID = id

	res, err := delete_command.New(
		req,
		delete_savings_goal_repository.NewPostgreSQL(db),
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

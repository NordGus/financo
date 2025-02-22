package update_child_handler

import (
	"encoding/json"
	"financo/core/scope_categories/application/commands/update_child_command"
	"financo/core/scope_categories/domain/requests"
	"financo/core/scope_categories/infrastructure/repositories/categories_repository"
	"financo/core/scope_categories/infrastructure/repositories/update_repository"
	"financo/core/scope_categories/infrastructure/services/message_broker"
	"financo/services/postgresql_database"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func HandlerFunc(w http.ResponseWriter, r *http.Request) {
	var (
		db         = postgresql_database.New()
		categories = categories_repository.NewPostgreSQL(db)
		update     = update_repository.NewPostgreSQL(db)
		broker     = message_broker.New()

		req requests.UpdateChild
	)

	parentId, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		log.Println("failed to parse category parent id", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	id, err := strconv.ParseInt(chi.URLParam(r, "childId"), 10, 64)
	if err != nil {
		log.Println("failed to parse category id", err)
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

	if parentId != req.ParentID {
		log.Println("parent ids don't match")
		http.Error(
			w,
			http.StatusText(http.StatusNotAcceptable),
			http.StatusNotAcceptable,
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

	res, err := update_child_command.New(req, categories, update, broker.Updated()).Run(r.Context())
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

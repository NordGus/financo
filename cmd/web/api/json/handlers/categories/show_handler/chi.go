package show_handler

import (
	"encoding/json"
	show_query "financo/core/scope_categories/application/queries/get_query"
	"financo/core/scope_categories/domain/requests"
	"financo/core/scope_categories/infrastructure/repositories/categories_repository"
	"financo/lib/nullable"
	"financo/models/account"
	"financo/services/postgresql_database"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/go-chi/chi/v5"
)

func HandlerFunc(w http.ResponseWriter, r *http.Request) {
	var (
		db   = postgresql_database.New()
		repo = categories_repository.NewPostgreSQL(db)

		req requests.Show
		err error
	)

	req.ID, err = strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		log.Println("failed to parse category id", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	res, err := show_query.New(req, repo).Find(r.Context())
	if err != nil {
		log.Println("query failed", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	resp, err := json.Marshal(res)
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

func parseKinds(r *http.Request, param string) ([]account.Kind, error) {
	out := make([]account.Kind, 0, 4)

	if !r.URL.Query().Has(param) {
		return out, nil
	}

	raw := strings.Split(r.URL.Query().Get(param), ",")

	for i := range raw {
		if raw[i] == "" {
			continue
		}

		out = append(out, account.Kind(raw[i]))
	}

	return out, nil
}

func parseNullableBool(r *http.Request, param string) (nullable.Type[bool], error) {
	var out nullable.Type[bool]

	if !r.URL.Query().Has(param) {
		return out, nil
	}

	out = nullable.New(r.URL.Query().Get(param) == "true")

	return out, nil
}

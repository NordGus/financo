package handlers

import (
	"encoding/json"
	"financo/server/accounts/queries/list_query"
	"financo/server/types/generic/context_key"
	"financo/server/types/records/account"
	"log"
	"net/http"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"
)

func List(w http.ResponseWriter, r *http.Request) {
	var (
		kinds    = make([]account.Kind, 0, 7)
		archived = r.URL.Query().Get("archived") == "true"
	)

	conn, ok := r.Context().Value(context_key.DB).(*pgxpool.Conn)
	if !ok {
		log.Println("failed to retrieved database connection")
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	for _, k := range strings.Split(r.URL.Query().Get("kind"), ",") {
		kinds = append(kinds, account.Kind(k))
	}

	res, err := list_query.New(kinds, archived, conn).Find(r.Context())
	if err != nil {
		log.Println("query failed", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	response, err := json.Marshal(&res)
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

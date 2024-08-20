package handlers

import (
	"encoding/json"
	"financo/server/summary/quries/summary_for_kind_query"
	"financo/server/types/generic/context_key"
	"financo/server/types/records/account"
	"log"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
)

func Capital(w http.ResponseWriter, r *http.Request) {
	var (
		kinds = []account.Kind{account.CapitalNormal, account.CapitalSavings}
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

	res, err := summary_for_kind_query.New(kinds, conn).Find(r.Context())
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
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Add("Content-Type", "application/json")
}

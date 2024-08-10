package handlers

import (
	"encoding/json"
	"financo/server/accounts/queries/detailed_children_query"
	"financo/server/accounts/queries/detailed_query"
	"financo/server/types/generic/context_key"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

func Show(w http.ResponseWriter, r *http.Request) {
	conn, ok := r.Context().Value(context_key.DB).(*pgxpool.Conn)
	if !ok {
		log.Println("db connection not found")
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	id, err := strconv.ParseInt(chi.URLParam(r, "accountID"), 10, 64)
	if err != nil {
		log.Println("failed to parse account id", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	res, err := detailed_query.New(id, conn).Find(r.Context())
	if err != nil {
		log.Println("account not found", err)
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	res.Children, err = detailed_children_query.New(id, conn).Find(r.Context())
	if err != nil {
		log.Println("failed to find account children", err)
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	for i := 0; i < len(res.Children); i++ {
		res.Balance += res.Children[i].Balance
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

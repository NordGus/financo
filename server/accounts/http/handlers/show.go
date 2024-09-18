package handlers

import (
	"encoding/json"
	"financo/server/accounts/queries/detailed_children_query"
	"financo/server/accounts/queries/detailed_query"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func Show(w http.ResponseWriter, r *http.Request) {
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

	res, err := detailed_query.New(id).Find(r.Context())
	if err != nil {
		log.Println("account not found", err)
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	res.Children, err = detailed_children_query.New(id).Find(r.Context())
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

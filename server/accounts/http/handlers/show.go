package handlers

import (
	"encoding/json"
	"financo/server/accounts/types/response"
	"financo/server/types/generic/context_key"
	"log"
	"net/http"
)

func Show(w http.ResponseWriter, r *http.Request) {
	acc, ok := r.Context().Value(context_key.Account).(*response.Detailed)
	if !ok {
		log.Println("account not found")
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	resp, err := json.Marshal(*acc)
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

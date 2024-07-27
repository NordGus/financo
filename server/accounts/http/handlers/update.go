package handlers

import (
	"encoding/json"
	"financo/server/accounts/types/response"
	"financo/server/types/generic/context_key"
	"log"
	"net/http"
)

// TODO: Implement save mechanism
func Update(w http.ResponseWriter, r *http.Request) {
	var (
		data = response.Detailed{Children: make([]response.DetailedChild, 0, 10)}
	)

	acc, ok := r.Context().Value(context_key.Account).(*response.Detailed)
	if !ok {
		log.Println("account not found")
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	body := r.Body
	defer func() {
		err := body.Close()
		if err != nil {
			log.Println("failed to close body", err)
		}
	}()

	err := json.NewDecoder(body).Decode(&data)
	if err != nil {
		log.Println("failed to decode body", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	log.Printf("%+v \n", data)

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

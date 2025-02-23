package currencies

import (
	"encoding/json"
	"financo/lib/currency"
	"log"
	"net/http"
)

func index(w http.ResponseWriter, r *http.Request) {
	response, err := json.Marshal(currency.List)
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

	w.Header().Add("Content-Type", "application/json")
}

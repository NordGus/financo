package health

import (
	"encoding/json"
	"financo/services/postgresql_database"
	"log"
	"net/http"
)

func database(w http.ResponseWriter, r *http.Request) {
	message := postgresql_database.New().Health()

	response, err := json.Marshal(message)
	if err != nil {
		log.Println("pong: marshal json:", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	_, err = w.Write(response)
	if err != nil {
		log.Println("pong: writing body:", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.Header().Add("Content-Type", "application/json")
}

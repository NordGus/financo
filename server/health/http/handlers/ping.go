package handlers

import (
	"encoding/json"
	"log"
	"net/http"
)

func Ping(w http.ResponseWriter, r *http.Request) {
	message := map[string]string{
		"status":  "ok",
		"message": "pong",
	}

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

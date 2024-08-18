package handlers

import (
	"encoding/json"
	"financo/server/transactions/commands/create_command"
	"financo/server/transactions/types/request"
	"financo/server/types/generic/context_key"
	"log"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
)

func Create(w http.ResponseWriter, r *http.Request) {
	var req request.Create

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

	body := r.Body
	defer func() {
		err := body.Close()
		if err != nil {
			log.Println("failed to close body", err)
		}
	}()

	err := json.NewDecoder(body).Decode(&req)
	if err != nil {
		log.Println("failed to decode body", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	res, err := create_command.New(conn, req).Run(r.Context())
	if err != nil {
		log.Println("command failed", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
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

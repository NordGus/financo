package handlers

import (
	"encoding/json"
	"financo/server/accounts/types/response"
	"financo/server/types/generic/context_key"
	"log"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func Destroy(w http.ResponseWriter, r *http.Request) {
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

	acc, ok := r.Context().Value(context_key.Account).(*response.Detailed)
	if !ok {
		log.Println("account not found")
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	tr, err := conn.Begin(r.Context())
	if !ok {
		log.Println("db connection failed to start transaction")
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}
	defer func() {
		err = tr.Commit(r.Context())
		if err != nil {
			log.Println("failed to commit transaction", err)
		}
	}()

	cmd, err := tr.Exec(
		r.Context(),
		"UPDATE accounts SET deleted_at = $2, updated_at = $2 WHERE id = $1 OR parent_id = $1",
		acc.ID,
		time.Now(),
	)
	if err != nil {
		log.Println("failed to delete account", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}
	if cmd.RowsAffected() == 0 {
		log.Println("failed to delete account")
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	ids := make([]int64, 0, len(acc.Children)+1)
	ids = append(ids, acc.ID)

	for i := 0; i < len(acc.Children); i++ {
		ids = append(ids, acc.Children[i].ID)
	}

	cmd, err = tr.Exec(
		r.Context(),
		`
UPDATE transactions
SET deleted_at = $2, updated_at = $2
WHERE source_id = ANY ($1) OR target_id = ANY ($1)`,
		ids,
		time.Now(),
	)
	if err != nil {
		log.Println("failed to delete account", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}
	if cmd.RowsAffected() == 0 {
		log.Println("failed to delete account")
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
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

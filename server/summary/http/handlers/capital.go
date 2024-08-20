package handlers

import (
	"encoding/json"
	"financo/server/summary/quries/capital_query"
	"financo/server/summary/types/response"
	"financo/server/types/generic/context_key"
	"financo/server/types/shared/currency"
	"log"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
)

const (
	creditsQuery = `
SELECT acc.currency, SUM(tr.target_amount)
FROM transactions tr
    INNER JOIN accounts acc ON acc.id = tr.target_id
WHERE
    acc.kind = ANY ($1)
    AND tr.deleted_at IS NULL
    AND acc.deleted_at IS NULL
    AND tr.executed_at IS NOT NULL
    AND tr.executed_at <= NOW()
GROUP BY
    acc.currency
ORDER BY acc.currency
`
	debitsQuery = `
SELECT acc.currency, SUM(- tr.source_amount)
FROM transactions tr
    INNER JOIN accounts acc ON acc.id = tr.source_id
WHERE
    acc.kind = ANY ($1)
    AND tr.deleted_at IS NULL
    AND acc.deleted_at IS NULL
    AND tr.issued_at <= NOW()
GROUP BY
    acc.currency
ORDER BY acc.currency
	`
)

type Balance struct {
	Currency currency.Type          `json:"currency"`
	Amount   int64                  `json:"amount"`
	Series   []response.SeriesEntry `json:"series"`
}

func Capital(w http.ResponseWriter, r *http.Request) {
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

	res, err := capital_query.New(conn).Find(r.Context())
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

package handlers

import (
	"encoding/json"
	"financo/server/types/generic/context_key"
	"financo/server/types/generic/nullable"
	"financo/server/types/records/account"
	"financo/server/types/shared/color"
	"financo/server/types/shared/currency"
	"financo/server/types/shared/icon"
	"log"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

const (
	pendingTransactionsQuery = `
SELECT
    tr.id,
    tr.issued_at,
    tr.executed_at,
    tr.source_amount,
    tr.target_amount,
    tr.created_at,
    tr.updated_at,
    src.id,
    src.kind,
    src.currency,
    src.name,
    src.color,
    src.icon,
    src.created_at,
    src.updated_at,
    trg.id,
    trg.kind,
    trg.currency,
    trg.name,
    trg.color,
    trg.icon,
    trg.created_at,
    trg.updated_at
FROM
    transactions tr
    INNER JOIN accounts src ON src.id = tr.source_id
    INNER JOIN accounts trg ON trg.id = tr.target_id
WHERE
    tr.deleted_at IS NULL
    AND src.deleted_at IS NULL
    AND trg.deleted_at IS NULL
	AND (tr.executed_at IS NULL OR tr.executed_at BETWEEN NOW() AND (NOW() + INTERVAL '1 month'))
	`
)

type Account struct {
	ID        int64         `json:"id"`
	Kind      account.Kind  `json:"kind"`
	Currency  currency.Type `json:"currency"`
	Name      string        `json:"name"`
	Color     color.Type    `json:"color"`
	Icon      icon.Type     `json:"icon"`
	CreatedAt time.Time     `json:"createdAt"`
	UpdatedAt time.Time     `json:"updatedAt"`
}

type Transaction struct {
	ID           int64                    `json:"id"`
	IssuedAt     time.Time                `json:"issuedAt"`
	ExecutedAt   nullable.Type[time.Time] `json:"executedAt"`
	Source       Account                  `json:"source"`
	SourceAmount int64                    `json:"sourceAmount"`
	Target       Account                  `json:"target"`
	TargetAmount int64                    `json:"targetAmount"`
	CreatedAt    time.Time                `json:"createdAt"`
	UpdatedAt    time.Time                `json:"updatedAt"`
}

func Pending(w http.ResponseWriter, r *http.Request) {
	var (
		ctx     = r.Context()
		results = make([]Transaction, 0, 50)
	)
	db, ok := ctx.Value(context_key.DB).(*pgxpool.Conn)
	if !ok {
		log.Println("failed to retrieved database connection")
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	rows, err := db.Query(ctx, pendingTransactionsQuery)
	if err != nil {
		log.Println("failed query", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var tr Transaction

		err = rows.Scan(
			&tr.ID,
			&tr.IssuedAt,
			&tr.ExecutedAt,
			&tr.SourceAmount,
			&tr.TargetAmount,
			&tr.CreatedAt,
			&tr.UpdatedAt,
			&tr.Source.ID,
			&tr.Source.Kind,
			&tr.Source.Currency,
			&tr.Source.Name,
			&tr.Source.Color,
			&tr.Source.Icon,
			&tr.Source.CreatedAt,
			&tr.Source.UpdatedAt,
			&tr.Target.ID,
			&tr.Target.Kind,
			&tr.Target.Currency,
			&tr.Target.Name,
			&tr.Target.Color,
			&tr.Target.Icon,
			&tr.Target.CreatedAt,
			&tr.Target.UpdatedAt,
		)
		if err != nil {
			log.Println("failed scan", err)
			http.Error(
				w,
				http.StatusText(http.StatusInternalServerError),
				http.StatusInternalServerError,
			)
			return
		}

		results = append(results, tr)
	}

	response, err := json.Marshal(results)
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

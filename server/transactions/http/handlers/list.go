package handlers

import (
	"encoding/json"
	"financo/server/types/generic/context_key"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"
)

const (
	transactionsQuery = `
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
	AND tr.executed_at IS NOT NULL
	`

	executedFromKey  = "executedFrom"
	executedUntilKey = "executedUntil"
	accountKey       = "account"
)

func List(w http.ResponseWriter, r *http.Request) {
	var (
		ctx         = r.Context()
		results     = make([]Transaction, 0, 50)
		query       = transactionsQuery
		filters     = make([]any, 0, 3)
		filterCount = 1
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

	if r.URL.Query().Has(executedFromKey) && r.URL.Query().Has(executedUntilKey) {
		filters = append(
			filters,
			r.URL.Query().Get(executedFromKey),
			r.URL.Query().Get(executedUntilKey),
		)

		query += " AND (tr.executed_at BETWEEN $1 AND $2)"
		filterCount += 2
	} else if r.URL.Query().Has(executedFromKey) {
		filters = append(filters, r.URL.Query().Get(executedFromKey))

		query += " AND tr.executed_at >= $1"
		filterCount++
	} else if r.URL.Query().Has(executedUntilKey) {
		filters = append(filters, r.URL.Query().Get(executedUntilKey))

		query += " AND tr.executed_at <= $1"
		filterCount++
	}

	if r.URL.Query().Has(accountKey) {
		var (
			err error
			raw = strings.Split(r.URL.Query().Get(accountKey), ",")
			ids = make([]int64, len(raw))
		)

		for i := 0; i < len(raw); i++ {
			ids[i], err = strconv.ParseInt(raw[i], 10, 64)
			if err != nil {
				log.Println("failed to parsed id", err)
				http.Error(
					w,
					http.StatusText(http.StatusInternalServerError),
					http.StatusInternalServerError,
				)
				return
			}
		}

		filters = append(filters, ids)

		query += fmt.Sprintf(
			" AND (tr.source_id = ANY ($%d) OR tr.target_id = ANY ($%d))",
			filterCount,
			filterCount,
		)
		filterCount++
	}

	rows, err := db.Query(ctx, query, filters...)
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

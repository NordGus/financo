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
	upcomingTransactionsQuery = `
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
    src_p.id,
    src_p.kind,
    src_p.currency,
    src_p.name,
    src_p.color,
    src_p.icon,
    src_p.created_at,
    src_p.updated_at,
    trg.id,
    trg.kind,
    trg.currency,
    trg.name,
    trg.color,
    trg.icon,
    trg.created_at,
    trg.updated_at,
    trgp.id,
    trgp.kind,
    trgp.currency,
    trgp.name,
    trgp.color,
    trgp.icon,
    trgp.created_at,
    trgp.updated_at
FROM
    transactions tr
    INNER JOIN accounts src ON src.id = tr.source_id
    LEFT JOIN accounts src_p ON src_p.id = src.parent_id
    INNER JOIN accounts trg ON trg.id = tr.target_id
    LEFT JOIN accounts trgp ON trgp.id = trg.parent_id
WHERE
    tr.deleted_at IS NULL
    AND src.deleted_at IS NULL
    AND trg.deleted_at IS NULL
	AND tr.executed_at IS NOT NULL
	AND tr.executed_at >= NOW()
	`
)

func Upcoming(w http.ResponseWriter, r *http.Request) {
	var (
		ctx         = r.Context()
		results     = make([]Transaction, 0, 50)
		query       = upcomingTransactionsQuery
		filters     = make([]any, 0, 2)
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

	if r.URL.Query().Has(executedUntilKey) {
		filters = append(filters, r.URL.Query().Get(executedUntilKey))

		query += fmt.Sprintf(" AND tr.executed_at <= $%d", filterCount)
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

		direct := fmt.Sprintf(
			"(tr.source_id = ANY ($%d) OR tr.target_id = ANY ($%d))",
			filterCount,
			filterCount,
		)

		indirect := fmt.Sprintf(
			"(src.parent_id = ANY ($%d) OR trg.parent_id = ANY ($%d))",
			filterCount,
			filterCount,
		)

		query += fmt.Sprintf(
			" AND (%s OR %s)",
			direct,
			indirect,
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
		var (
			tr        Transaction
			srcParent NullableAccount
			trgParent NullableAccount
		)

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
			&srcParent.ID,
			&srcParent.Kind,
			&srcParent.Currency,
			&srcParent.Name,
			&srcParent.Color,
			&srcParent.Icon,
			&srcParent.CreatedAt,
			&srcParent.UpdatedAt,
			&tr.Target.ID,
			&tr.Target.Kind,
			&tr.Target.Currency,
			&tr.Target.Name,
			&tr.Target.Color,
			&tr.Target.Icon,
			&tr.Target.CreatedAt,
			&tr.Target.UpdatedAt,
			&trgParent.ID,
			&trgParent.Kind,
			&trgParent.Currency,
			&trgParent.Name,
			&trgParent.Color,
			&trgParent.Icon,
			&trgParent.CreatedAt,
			&trgParent.UpdatedAt,
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

		tr.Source.Parent = buildParent(srcParent)
		tr.Target.Parent = buildParent(trgParent)

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
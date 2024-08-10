package middleware

import (
	"context"
	"financo/server/accounts/types/response"
	"financo/server/types/generic/context_key"
	"financo/server/types/generic/nullable"
	"financo/server/types/records/account"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

const (
	accountQuery = `
WITH
    active_transactions (
        id,
        source_id,
        target_id,
        issued_at,
        executed_at,
        source_amount,
        target_amount
    ) AS (
        SELECT
            id,
            source_id,
            target_id,
            issued_at,
            executed_at,
            source_amount,
            target_amount
        FROM transactions
        WHERE
            deleted_at IS NULL
            AND executed_at IS NOT NULL
            AND executed_at <= NOW()
    ),
    history_accounts (id, parent_id, balance, at) AS (
        SELECT
			acc.id,
			acc.parent_id,
			SUM(
                CASE
                    WHEN tr.source_id = acc.id THEN - tr.source_amount
                    ELSE tr.target_amount
                END
            ) AS balance,
			MAX(tr.executed_at) AS at
        FROM
            accounts acc
            LEFT JOIN active_transactions tr ON tr.source_id = acc.id
            OR tr.target_id = acc.id
        WHERE
            acc.parent_id IS NOT NULL
            AND acc.deleted_at IS NULL
            AND acc.kind = $1
        GROUP BY
            acc.id
    )
SELECT
    acc.id,
    acc.kind,
    acc.currency,
    acc.name,
    acc.description,
    SUM(
        COALESCE(
            CASE
                WHEN tr.source_id = acc.id THEN - tr.source_amount
                ELSE tr.target_amount
            END,
            0
        )
    ) AS balance,
    acc.capital,
    MAX(hist.balance)::bigint AS hist_balance,
    MAX(hist.at)::date AS hist_at,
	acc.color,
    acc.icon,
    acc.archived_at,
    acc.created_at,
    acc.updated_at
FROM
    accounts acc
    LEFT JOIN active_transactions tr ON tr.source_id = acc.id
    OR tr.target_id = acc.id
    LEFT JOIN history_accounts hist ON hist.parent_id = acc.id
WHERE
    acc.deleted_at IS NULL
	AND acc.parent_id IS NULL
    AND acc.kind != $1
    AND acc.id = $2
GROUP BY
    acc.id
	`
)

func GetAccount(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var (
			ctx    = r.Context()
			db, ok = ctx.Value(context_key.DB).(*pgxpool.Conn)
			id     = chi.URLParam(r, "accountID")

			acc     response.Detailed
			histBlc nullable.Type[int64]
			histAt  nullable.Type[time.Time]
		)

		if !ok {
			log.Println("failed to retrieved database connection")
			http.Error(
				w,
				http.StatusText(http.StatusInternalServerError),
				http.StatusInternalServerError,
			)
			return
		}

		if id == "" {
			log.Println("accountID is not present")
			http.Error(
				w,
				http.StatusText(http.StatusInternalServerError),
				http.StatusInternalServerError,
			)
			return
		}

		err := db.QueryRow(ctx, accountQuery, account.SystemHistoric, id).Scan(
			&acc.ID,
			&acc.Kind,
			&acc.Currency,
			&acc.Name,
			&acc.Description,
			&acc.Balance,
			&acc.Capital,
			&histBlc,
			&histAt,
			&acc.Color,
			&acc.Icon,
			&acc.ArchivedAt,
			&acc.CreatedAt,
			&acc.UpdatedAt,
		)
		if err != nil {
			log.Println("failed query", err)
			http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
			return
		}

		if histBlc.Valid && histAt.Valid {
			acc.History = nullable.New(response.History{
				Balance: histBlc.Val,
				At:      histAt.Val,
			})
		}

		nextCtx := context.WithValue(ctx, context_key.Account, &acc)
		next.ServeHTTP(w, r.WithContext(nextCtx))
	})
}

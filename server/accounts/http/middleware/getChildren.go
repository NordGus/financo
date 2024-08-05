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

	"github.com/jackc/pgx/v5/pgxpool"
)

const (
	childrenQuery = `
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
    MAX(hist.balance) AS hist_balance,
    MAX(hist.at) AS hist_at,
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
	AND acc.parent_id IS NOT NULL
    AND acc.kind != $1
    AND acc.parent_id = $2
GROUP BY
    acc.id
ORDER BY acc.archived_at DESC NULLS FIRST, acc.created_at
	`
)

func GetChildren(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var (
			ctx        = r.Context()
			db, okDB   = ctx.Value(context_key.DB).(*pgxpool.Conn)
			acc, okAcc = ctx.Value(context_key.Account).(*response.Detailed)
			children   = make([]response.DetailedChild, 0, 10)
		)

		if !okDB {
			log.Println("failed to retrieved database connection")
			http.Error(
				w,
				http.StatusText(http.StatusInternalServerError),
				http.StatusInternalServerError,
			)
			return
		}

		if !okAcc {
			log.Println("account not found")
			http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
			return
		}

		rows, err := db.Query(ctx, childrenQuery, account.SystemHistoric, acc.ID)
		if err != nil {
			log.Println("failed query", err)
			http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
			return
		}
		defer rows.Close()

		for rows.Next() {
			var (
				child   response.DetailedChild
				histBlc nullable.Type[int64]
				histAt  nullable.Type[time.Time]
			)

			err = rows.Scan(
				&child.ID,
				&child.Kind,
				&child.Currency,
				&child.Name,
				&child.Description,
				&child.Balance,
				&child.Capital,
				&histBlc,
				&histAt,
				&child.Color,
				&child.Icon,
				&child.ArchivedAt,
				&child.CreatedAt,
				&child.UpdatedAt,
			)

			if err != nil {
				log.Println("failed to build child", err)
				http.Error(
					w,
					http.StatusText(http.StatusInternalServerError),
					http.StatusInternalServerError,
				)
				return
			}

			if histBlc.Valid && histAt.Valid {
				child.History = nullable.New(response.History{
					Balance: histBlc.Val,
					At:      histAt.Val,
				})
			}

			children = append(children, child)
		}

		if len(children) > 0 {
			acc.Children = children
		}

		nextCtx := context.WithValue(ctx, context_key.Account, acc)
		next.ServeHTTP(w, r.WithContext(nextCtx))
	})
}

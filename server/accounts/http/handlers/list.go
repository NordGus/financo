package handlers

import (
	"encoding/json"
	"financo/server/types/generic/context_key"
	"financo/server/types/generic/nullable"
	"financo/server/types/records/account"
	"financo/server/types/shared/color"
	"financo/server/types/shared/currency"
	"financo/server/types/shared/icon"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

const (
	listQuery = `
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
    children (
        id,
        parent_id,
        kind,
        currency,
        name,
        description,
        balance,
        capital,
        color,
        icon,
        archived_at,
        created_at,
        updated_at
    ) AS (
        SELECT
            acc.id,
            acc.parent_id,
            acc.kind,
            acc.currency,
            acc.name,
            acc.description,
            SUM(
                CASE
                    WHEN tr.source_id = acc.id THEN - tr.source_amount
					WHEN tr.target_id = acc.id THEN tr.target_amount
                    ELSE 0
                END
            ) AS balance,
            acc.capital,
            acc.color,
            acc.icon,
            acc.archived_at,
            acc.created_at,
            acc.updated_at
        FROM
            accounts acc
            LEFT JOIN active_transactions tr ON tr.source_id = acc.id
            OR tr.target_id = acc.id
        WHERE
            acc.parent_id IS NOT NULL
			AND acc.deleted_at IS NULL
            AND acc.archived_at IS NULL
            AND acc.kind != $1
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
        CASE
			WHEN blc.source_id = acc.id THEN - blc.source_amount
			WHEN blc.target_id = acc.id THEN blc.target_amount
			ELSE 0
		END
    ) AS balance,
    acc.capital,
    acc.color,
    acc.icon,
    acc.archived_at,
    acc.created_at,
    acc.updated_at,
    child.id,
    MAX(child.kind) AS child_kind,
    MAX(child.currency) AS child_currency,
    MAX(child.name) AS child_name,
    MAX(child.description) AS child_description,
    MAX(child.balance)::bigint AS child_balance,
    MAX(child.capital) AS child_capital,
    MAX(child.color) AS child_color,
    MAX(child.icon) AS child_icon,
    MAX(child.archived_at) AS child_archived_at,
    MAX(child.created_at) AS child_created_at,
    MAX(child.updated_at) AS child_updated_at
FROM
    accounts acc
    LEFT JOIN children child ON child.parent_id = acc.id
    LEFT JOIN active_transactions blc ON blc.source_id = acc.id
    OR blc.target_id = acc.id
WHERE
    acc.kind = ANY ($2)
    AND acc.parent_id IS NULL
    AND acc.deleted_at IS NULL
	`

	archivedKey = "archived"
	kindKey     = "kind"
)

type ListFilter struct {
	Kinds    []account.Kind
	Archived string
}

type Preview struct {
	ID          int64                    `json:"id"`
	Kind        account.Kind             `json:"kind"`
	Currency    currency.Type            `json:"currency"`
	Name        string                   `json:"name"`
	Description nullable.Type[string]    `json:"description"`
	Balance     int64                    `json:"balance"`
	Capital     int64                    `json:"capital"`
	Color       color.Type               `json:"color"`
	Icon        icon.Type                `json:"icon"`
	ArchivedAt  nullable.Type[time.Time] `json:"archivedAt"`
	CreatedAt   time.Time                `json:"createdAt"`
	UpdatedAt   time.Time                `json:"updatedAt"`
	Children    []Preview                `json:"children"`
}

type Child struct {
	ID          nullable.Type[int64]
	Kind        nullable.Type[string]
	Currency    nullable.Type[string]
	Name        nullable.Type[string]
	Description nullable.Type[string]
	Balance     nullable.Type[int64]
	Capital     nullable.Type[int64]
	Color       nullable.Type[string]
	Icon        nullable.Type[string]
	ArchivedAt  nullable.Type[time.Time]
	CreatedAt   nullable.Type[time.Time]
	UpdatedAt   nullable.Type[time.Time]
}

func List(w http.ResponseWriter, r *http.Request) {
	var (
		ctx     = r.Context()
		kinds   = make([]account.Kind, 0, 7)
		results = make([]Preview, 0, 10)
		query   = listQuery
		idx     = 0
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

	if r.URL.Query().Has(kindKey) {
		for _, k := range strings.Split(r.URL.Query().Get(kindKey), ",") {
			kind := account.Kind(k)

			if err := kindsValidation(kind); err != nil {
				log.Println(err)
				http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
				return
			}

			kinds = append(kinds, kind)
		}
	} else {
		kinds = append(
			kinds,
			account.CapitalNormal,
			account.CapitalSavings,
			account.DebtCredit,
			account.DebtLoan,
			account.DebtPersonal,
			account.ExternalExpense,
			account.ExternalIncome,
		)
	}

	if r.URL.Query().Has(archivedKey) && r.URL.Query().Get(archivedKey) == "true" {
		query += " AND acc.archived_at IS NOT NULL"
	} else {
		query += " AND acc.archived_at IS NULL"
	}

	query += " GROUP BY child.id, acc.id"

	rows, err := db.Query(ctx, query, account.SystemHistoric, kinds)
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
			acc   Preview
			child Child
		)

		err = rows.Scan(
			&acc.ID,
			&acc.Kind,
			&acc.Currency,
			&acc.Name,
			&acc.Description,
			&acc.Balance,
			&acc.Capital,
			&acc.Color,
			&acc.Icon,
			&acc.ArchivedAt,
			&acc.CreatedAt,
			&acc.UpdatedAt,
			&child.ID,
			&child.Kind,
			&child.Currency,
			&child.Name,
			&child.Description,
			&child.Balance,
			&child.Capital,
			&child.Color,
			&child.Icon,
			&child.ArchivedAt,
			&child.CreatedAt,
			&child.UpdatedAt,
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

		if len(results) == 0 {
			results = append(results, acc)
			results[idx].Children = make([]Preview, 0, 5)
		} else if results[idx].ID != acc.ID {
			idx++
			results = append(results, acc)
			results[idx].Children = make([]Preview, 0, 5)
		}

		if child.ID.Valid {
			results[idx].Children = append(results[idx].Children, buildChild(child))
		}
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

func kindsValidation(k account.Kind) error {
	kinds := map[account.Kind]bool{
		account.CapitalNormal:   true,
		account.CapitalSavings:  true,
		account.DebtPersonal:    true,
		account.DebtLoan:        true,
		account.DebtCredit:      true,
		account.ExternalIncome:  true,
		account.ExternalExpense: true,
	}

	if _, ok := kinds[k]; !ok {
		return fmt.Errorf("invalid account kind: %s", k)
	}

	return nil
}

func buildChild(child Child) Preview {
	return Preview{
		ID:          child.ID.Val,
		Kind:        account.Kind(child.Kind.Val),
		Currency:    currency.Type(child.Currency.Val),
		Name:        child.Name.Val,
		Description: child.Description,
		Balance:     child.Balance.Val,
		Capital:     child.Capital.Val,
		Color:       color.Type(child.Color.Val),
		Icon:        icon.Type(child.Icon.Val),
		ArchivedAt:  child.ArchivedAt,
		CreatedAt:   child.CreatedAt.Val,
		UpdatedAt:   child.CreatedAt.Val,
	}
}

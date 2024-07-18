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
	transactionsWithQuery = "active_transactions (id, source_id, target_id, issued_at, executed_at, source_amount, target_amount) AS (SELECT id, source_id, target_id, issued_at, executed_at, source_amount, target_amount FROM transactions WHERE deleted_at IS NULL)"

	historyAccountsWithQuery = "history_accounts (parent_id, has_history, amount, history_at) AS (SELECT acc.parent_id, COUNT(tr.id) > 0 AS has_history, MAX(CASE WHEN tr.source_id = acc.id THEN tr.target_amount ELSE - tr.source_amount END) as amount, MAX(tr.executed_at) AS history_at FROM accounts acc LEFT JOIN active_transactions tr ON tr.source_id = acc.id OR tr.target_id = acc.id WHERE acc.parent_id IS NOT NULL AND acc.kind = $1 GROUP BY acc.parent_id)"

	listQuery = "SELECT acc.id, acc.kind, acc.currency, acc.name, acc.description, acc.capital, acc.color, acc.icon, SUM(CASE WHEN blc.target_id = acc.id THEN blc.target_amount ELSE - blc.source_amount END) AS balance, bool_and(hist.has_history) AS has_history, MAX(hist.amount) AS history_amount, MAX(hist.history_at) AS history_at, acc.archived_at, acc.created_at, acc.updated_at FROM accounts acc LEFT JOIN history_accounts hist ON hist.parent_id = acc.id LEFT JOIN active_transactions blc ON blc.source_id = acc.id OR blc.target_id = acc.id WHERE acc.kind = ANY ($2) AND acc.archived_at %s AND acc.deleted_at IS NULL GROUP BY acc.id"
)

type ListFilter struct {
	Kinds    []account.Kind
	Archived string
}

type History struct {
	Present bool                     `json:"present"`
	Amount  nullable.Type[int64]     `json:"amount"`
	At      nullable.Type[time.Time] `json:"at"`
}

type Account struct {
	ID          int64                    `json:"id"`
	Kind        account.Kind             `json:"kind"`
	Currency    currency.Type            `json:"currency"`
	Name        string                   `json:"name"`
	Description nullable.Type[string]    `json:"description"`
	Capital     int64                    `json:"capital"`
	Color       color.Type               `json:"color"`
	Icon        icon.Type                `json:"icon"`
	Balance     int64                    `json:"balance"`
	History     History                  `json:"history"`
	ArchivedAt  nullable.Type[time.Time] `json:"archivedAt"`
	CreatedAt   time.Time                `json:"createdAt"`
	UpdatedAt   time.Time                `json:"updatedAt"`
}

func List(w http.ResponseWriter, r *http.Request) {
	var (
		ctx     = r.Context()
		filters = ListFilter{
			Kinds:    make([]account.Kind, 0, 7),
			Archived: "IS NULL",
		}
		results = make([]Account, 0, 10)
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

	for _, k := range strings.Split(r.URL.Query().Get("kind"), ",") {
		kind := account.Kind(k)

		if err := kindsValidation(kind); err != nil {
			log.Println(err)
			http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
			return
		}

		filters.Kinds = append(filters.Kinds, kind)
	}

	archived := r.URL.Query().Get("archived")

	if archived != "" && archived != "true" {
		log.Println("invalid value for archived")
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	} else if archived != "" {
		filters.Archived = "IS NOT NULL"
	}

	query := fmt.Sprintf(
		"WITH %s, %s %s",
		transactionsWithQuery,
		historyAccountsWithQuery,
		fmt.Sprintf(listQuery, filters.Archived),
	)

	rows, err := db.Query(ctx, query, account.SystemHistoric, filters.Kinds)
	if err != nil {
		log.Println("failed query", err)
		http.Error(
			w,
			http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError,
		)
		return
	}

	for rows.Next() {
		acc := Account{}

		err = rows.Scan(
			&acc.ID,
			&acc.Kind,
			&acc.Currency,
			&acc.Name,
			&acc.Description,
			&acc.Capital,
			&acc.Color,
			&acc.Icon,
			&acc.Balance,
			&acc.History.Present,
			&acc.History.Amount,
			&acc.History.At,
			&acc.ArchivedAt,
			&acc.CreatedAt,
			&acc.UpdatedAt,
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

		results = append(results, acc)
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

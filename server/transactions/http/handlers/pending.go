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
	"strconv"
	"strings"
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
    tr.notes,
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
	AND tr.executed_at IS NULL
	`
)

type Parent struct {
	ID        int64         `json:"id"`
	Kind      account.Kind  `json:"kind"`
	Currency  currency.Type `json:"currency"`
	Name      string        `json:"name"`
	Color     color.Type    `json:"color"`
	Icon      icon.Type     `json:"icon"`
	CreatedAt time.Time     `json:"createdAt"`
	UpdatedAt time.Time     `json:"updatedAt"`
}

type Account struct {
	ID         int64                    `json:"id"`
	Kind       account.Kind             `json:"kind"`
	Currency   currency.Type            `json:"currency"`
	Name       string                   `json:"name"`
	Color      color.Type               `json:"color"`
	Icon       icon.Type                `json:"icon"`
	ArchivedAt nullable.Type[time.Time] `json:"archivedAt"`
	CreatedAt  time.Time                `json:"createdAt"`
	UpdatedAt  time.Time                `json:"updatedAt"`
	Parent     nullable.Type[Parent]    `json:"parent"`
}

type Transaction struct {
	ID           int64                    `json:"id"`
	IssuedAt     time.Time                `json:"issuedAt"`
	ExecutedAt   nullable.Type[time.Time] `json:"executedAt"`
	Source       Account                  `json:"source"`
	SourceAmount int64                    `json:"sourceAmount"`
	Target       Account                  `json:"target"`
	TargetAmount int64                    `json:"targetAmount"`
	Notes        nullable.Type[string]    `json:"notes"`
	CreatedAt    time.Time                `json:"createdAt"`
	UpdatedAt    time.Time                `json:"updatedAt"`
}

type NullableAccount struct {
	ID         nullable.Type[int64]     `json:"id"`
	Kind       nullable.Type[string]    `json:"kind"`
	Currency   nullable.Type[string]    `json:"currency"`
	Name       nullable.Type[string]    `json:"name"`
	Color      nullable.Type[string]    `json:"color"`
	Icon       nullable.Type[string]    `json:"icon"`
	ArchivedAt nullable.Type[time.Time] `json:"archivedAt"`
	CreatedAt  nullable.Type[time.Time] `json:"createdAt"`
	UpdatedAt  nullable.Type[time.Time] `json:"updatedAt"`
}

func Pending(w http.ResponseWriter, r *http.Request) {
	var (
		ctx         = r.Context()
		results     = make([]Transaction, 0, 50)
		query       = pendingTransactionsQuery
		filters     = make([]any, 0, 1)
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
			&tr.Notes,
			&tr.CreatedAt,
			&tr.UpdatedAt,
			&tr.Source.ID,
			&tr.Source.Kind,
			&tr.Source.Currency,
			&tr.Source.Name,
			&tr.Source.Color,
			&tr.Source.Icon,
			&tr.Source.ArchivedAt,
			&tr.Source.CreatedAt,
			&tr.Source.UpdatedAt,
			&srcParent.ID,
			&srcParent.Kind,
			&srcParent.Currency,
			&srcParent.Name,
			&srcParent.Color,
			&srcParent.Icon,
			&srcParent.ArchivedAt,
			&srcParent.CreatedAt,
			&srcParent.UpdatedAt,
			&tr.Target.ID,
			&tr.Target.Kind,
			&tr.Target.Currency,
			&tr.Target.Name,
			&tr.Target.Color,
			&tr.Target.Icon,
			&tr.Target.ArchivedAt,
			&tr.Target.CreatedAt,
			&tr.Target.UpdatedAt,
			&trgParent.ID,
			&trgParent.Kind,
			&trgParent.Currency,
			&trgParent.Name,
			&trgParent.Color,
			&trgParent.Icon,
			&trgParent.ArchivedAt,
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

func buildParent(data NullableAccount) nullable.Type[Parent] {
	if data.ID.Valid {
		return nullable.New(Parent{
			ID:        data.ID.Val,
			Kind:      account.Kind(data.Kind.Val),
			Currency:  currency.Type(data.Currency.Val),
			Name:      data.Name.Val,
			Color:     color.Type(data.Color.Val),
			Icon:      icon.Type(data.Icon.Val),
			CreatedAt: data.CreatedAt.Val,
			UpdatedAt: data.UpdatedAt.Val,
		})
	}

	return nullable.Type[Parent]{}
}

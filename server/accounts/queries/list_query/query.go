package list_query

import (
	"context"
	"errors"
	"financo/server/accounts/types/response"
	"financo/server/services/postgres_database"
	"financo/server/types/generic/nullable"
	"financo/server/types/queries"
	"financo/server/types/records/account"
	"financo/server/types/shared/color"
	"financo/server/types/shared/currency"
	"financo/server/types/shared/icon"
	"time"
)

// TODO: Refactor to use math/big package

const (
	sqlQuery = `
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
            AND (executed_at IS NULL OR executed_at <= NOW())
			AND issued_at <= NOW()
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
)

// [ ] change when nullable parsing implementation for custom type is done
type row struct {
	id               int64
	kind             string
	currency         string
	name             string
	description      nullable.Type[string]
	balance          int64
	capital          int64
	color            string
	icon             string
	archivedAt       nullable.Type[time.Time]
	createdAt        time.Time
	updatedAt        time.Time
	childId          nullable.Type[int64]
	childKind        nullable.Type[string]
	childCurrency    nullable.Type[string]
	childName        nullable.Type[string]
	childDescription nullable.Type[string]
	childBalance     nullable.Type[int64]
	childCapital     nullable.Type[int64]
	childColor       nullable.Type[string]
	childIcon        nullable.Type[string]
	childArchivedAt  nullable.Type[time.Time]
	childCreatedAt   nullable.Type[time.Time]
	childUpdatedAt   nullable.Type[time.Time]
}

type query struct {
	kinds    []account.Kind
	archived bool
}

func New(kinds []account.Kind, archived bool) queries.Query[[]response.Preview] {
	return &query{
		kinds:    kinds,
		archived: archived,
	}
}

func (q *query) Find(ctx context.Context) ([]response.Preview, error) {
	var (
		queryStr = sqlQuery
		kinds    = q.filterKinds()
		res      = make([]response.Preview, 0, 10)
		idx      = -1
		postgres = postgres_database.New()
	)

	if q.archived {
		queryStr += " AND acc.archived_at IS NOT NULL"
	}

	if !q.archived {
		queryStr += " AND acc.archived_at IS NULL"
	}

	queryStr += " GROUP BY child.id, acc.id"

	conn, err := postgres.Conn(ctx)
	if err != nil {
		return res, errors.Join(errors.New("failed to get database connection"), err)
	}
	defer conn.Close()

	rows, err := conn.QueryContext(ctx, queryStr, account.SystemHistoric, kinds)
	if err != nil {
		return res, errors.Join(errors.New("failed to execute query"), err)
	}
	defer rows.Close()

	for rows.Next() {
		var r row

		err = rows.Scan(
			&r.id,
			&r.kind,
			&r.currency,
			&r.name,
			&r.description,
			&r.balance,
			&r.capital,
			&r.color,
			&r.icon,
			&r.archivedAt,
			&r.createdAt,
			&r.updatedAt,
			&r.childId,
			&r.childKind,
			&r.childCurrency,
			&r.childName,
			&r.childDescription,
			&r.childBalance,
			&r.childCapital,
			&r.childColor,
			&r.childIcon,
			&r.childArchivedAt,
			&r.childCreatedAt,
			&r.childUpdatedAt,
		)
		if err != nil {
			return res, errors.Join(errors.New("failed to scan rows"), err)
		}

		if idx < 0 {
			res = append(res, buildPreview(r))
			idx = 0
		}

		if res[idx].ID != r.id {
			res = append(res, buildPreview(r))
			idx++
		}

		if r.childId.Valid {
			res[idx].Children = append(res[idx].Children, buildPreviewChild(r))
		}
	}

	return res, nil
}

func (q *query) filterKinds() []account.Kind {
	var (
		kinds    = make([]account.Kind, 0, 7)
		accepted = map[account.Kind]bool{
			account.CapitalNormal:   true,
			account.CapitalSavings:  true,
			account.DebtPersonal:    true,
			account.DebtLoan:        true,
			account.DebtCredit:      true,
			account.ExternalIncome:  true,
			account.ExternalExpense: true,
		}
	)

	for i := 0; i < len(q.kinds); i++ {
		if accepted[q.kinds[i]] {
			kinds = append(kinds, q.kinds[i])
		}
	}

	if len(kinds) == 0 {
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

	return kinds
}

func buildPreview(r row) response.Preview {
	return response.Preview{
		ID:          r.id,
		Kind:        account.Kind(r.kind),
		Currency:    currency.Type(r.currency),
		Name:        r.name,
		Description: r.description,
		Balance:     r.balance,
		Capital:     r.capital,
		Color:       color.Type(r.color),
		Icon:        icon.Type(r.icon),
		ArchivedAt:  r.archivedAt,
		CreatedAt:   r.createdAt,
		UpdatedAt:   r.updatedAt,
		Children:    make([]response.PreviewChild, 0, 10),
	}
}

func buildPreviewChild(r row) response.PreviewChild {
	return response.PreviewChild{
		ID:          r.childId.Val,
		Kind:        account.Kind(r.childKind.Val),
		Currency:    currency.Type(r.childCurrency.Val),
		Name:        r.childName.Val,
		Description: r.childDescription,
		Balance:     r.childBalance.Val,
		Capital:     r.childCapital.Val,
		Color:       color.Type(r.childColor.Val),
		Icon:        icon.Type(r.childIcon.Val),
		ArchivedAt:  r.childArchivedAt,
		CreatedAt:   r.childCreatedAt.Val,
		UpdatedAt:   r.childUpdatedAt.Val,
	}
}

package select_query

import (
	"context"
	"errors"
	"financo/server/accounts/types/response"
	"financo/server/types/generic/nullable"
	"financo/server/types/queries"
	"financo/server/types/records/account"
	"financo/server/types/shared/color"
	"financo/server/types/shared/currency"
	"financo/server/types/shared/icon"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

const (
	sqlQuery = `
WITH
    children (
        id,
        parent_id,
        kind,
        currency,
        name,
        description,
        color,
        icon,
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
            acc.color,
            acc.icon,
            acc.created_at,
            acc.updated_at
        FROM
            accounts acc
        WHERE
            acc.parent_id IS NOT NULL
			AND acc.deleted_at IS NULL
            AND acc.kind != $1
    )
SELECT
    acc.id,
    acc.kind,
    acc.currency,
    acc.name,
    acc.description,
    acc.color,
    acc.icon,
    acc.created_at,
    acc.updated_at,
    child.id,
    child.kind,
    child.currency,
    child.name,
    child.description,
    child.color,
    child.icon,
    child.created_at,
    child.updated_at
FROM
    accounts acc
    LEFT JOIN children child ON child.parent_id = acc.id
WHERE
    acc.kind = ANY ($2)
    AND acc.parent_id IS NULL
    AND acc.deleted_at IS NULL
	`
)

type row struct {
	id               int64
	kind             string
	currency         string
	name             string
	description      nullable.Type[string]
	color            string
	icon             string
	createdAt        time.Time
	updatedAt        time.Time
	childId          nullable.Type[int64]
	childKind        nullable.Type[string]
	childCurrency    nullable.Type[string]
	childName        nullable.Type[string]
	childDescription nullable.Type[string]
	childColor       nullable.Type[string]
	childIcon        nullable.Type[string]
	childCreatedAt   nullable.Type[time.Time]
	childUpdatedAt   nullable.Type[time.Time]
}

type query struct {
	kinds    []account.Kind
	archived bool
	conn     *pgxpool.Conn
}

func New(kinds []account.Kind, archived bool, conn *pgxpool.Conn) queries.Query[[]response.Select] {
	return &query{
		kinds:    kinds,
		archived: archived,
		conn:     conn,
	}
}

func (q *query) Find(ctx context.Context) ([]response.Select, error) {
	var (
		queryStr = sqlQuery
		kinds    = q.filterKinds()
		res      = make([]response.Select, 0, 10)
		idx      = -1
	)

	if q.archived {
		queryStr += " AND acc.archived_at IS NOT NULL"
	}

	if !q.archived {
		queryStr += " AND acc.archived_at IS NULL"
	}

	rows, err := q.conn.Query(ctx, queryStr, account.SystemHistoric, kinds)
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
			&r.color,
			&r.icon,
			&r.createdAt,
			&r.updatedAt,
			&r.childId,
			&r.childKind,
			&r.childCurrency,
			&r.childName,
			&r.childDescription,
			&r.childColor,
			&r.childIcon,
			&r.childCreatedAt,
			&r.childUpdatedAt,
		)
		if err != nil {
			return res, errors.Join(errors.New("failed to scan rows"), err)
		}

		if idx < 0 {
			res = append(res, buildSelect(r))
			idx = 0
		}

		if res[idx].ID != r.id {
			res = append(res, buildSelect(r))
			idx++
		}

		if r.childId.Valid {
			res[idx].Children = append(res[idx].Children, buildSelectChild(r))
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

func buildSelect(r row) response.Select {
	return response.Select{
		ID:          r.id,
		Kind:        account.Kind(r.kind),
		Currency:    currency.Type(r.currency),
		Name:        r.name,
		Description: r.description,
		Color:       color.Type(r.color),
		Icon:        icon.Type(r.icon),
		CreatedAt:   r.createdAt,
		UpdatedAt:   r.updatedAt,
		Children:    make([]response.SelectChild, 0, 10),
	}
}

func buildSelectChild(r row) response.SelectChild {
	return response.SelectChild{
		ID:          r.childId.Val,
		Kind:        account.Kind(r.childKind.Val),
		Currency:    currency.Type(r.childCurrency.Val),
		Name:        r.childName.Val,
		Description: r.childDescription,
		Color:       color.Type(r.childColor.Val),
		Icon:        icon.Type(r.childIcon.Val),
		CreatedAt:   r.childCreatedAt.Val,
		UpdatedAt:   r.childUpdatedAt.Val,
	}
}

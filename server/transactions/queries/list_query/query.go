package list_query

import (
	"context"
	"errors"
	base "financo/server/transactions/queries"
	"financo/server/transactions/types/response"
	"financo/server/types/generic/nullable"
	"financo/server/types/queries"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type query struct {
	from     nullable.Type[time.Time]
	to       nullable.Type[time.Time]
	accounts []int64
	conn     *pgxpool.Conn
}

func New(
	from nullable.Type[time.Time],
	to nullable.Type[time.Time],
	accounts []int64,
	conn *pgxpool.Conn,
) queries.Query[[]response.Detailed] {
	return &query{
		from:     from,
		to:       to,
		accounts: accounts,
		conn:     conn,
	}
}

func (q *query) Find(ctx context.Context) ([]response.Detailed, error) {
	var (
		query   = base.BaseQueryList + " AND tr.executed_at IS NOT NULL"
		res     = make([]response.Detailed, 0, 20)
		filters = make([]any, 0, 3)
		filter  = 1
	)

	if q.from.Valid && q.to.Valid {
		filters = append(filters, q.from.Val, q.to.Val)
		query += " AND (tr.executed_at BETWEEN $1 AND $2)"
		filter += 2
	} else if q.from.Valid {
		filters = append(filters, q.from.Val)
		query += " AND tr.executed_at >= $1"
		filter++
	} else if q.to.Valid {
		filters = append(filters, q.to.Val)
		query += " AND tr.executed_at <= $1"
		filter++
	}

	if len(q.accounts) > 0 {
		query += fmt.Sprintf(" AND (tr.source_id = ANY ($%d) OR tr.target_id = ANY ($%d))", filter, filter)
		filters = append(filters, q.accounts)
		filter++
	}

	rows, err := q.conn.Query(ctx, query, filters...)
	if err != nil {
		return res, errors.Join(errors.New("failed to execute query"), err)
	}
	defer rows.Close()

	for rows.Next() {
		var row base.BaseQueryListRow

		err = rows.Scan(
			&row.ID,
			&row.IssuedAt,
			&row.ExecutedAt,
			&row.SourceAmount,
			&row.TargetAmount,
			&row.Notes,
			&row.CreatedAt,
			&row.UpdatedAt,
			&row.SrcID,
			&row.SrcKind,
			&row.SrcCurrency,
			&row.SrcName,
			&row.SrcColor,
			&row.SrcIcon,
			&row.SrcArchivedAt,
			&row.SrcCreatedAt,
			&row.SrcUpdatedAt,
			&row.SrcParentID,
			&row.SrcParentKind,
			&row.SrcParentCurrency,
			&row.SrcParentName,
			&row.SrcParentColor,
			&row.SrcParentIcon,
			&row.SrcParentArchivedAt,
			&row.SrcParentCreatedAt,
			&row.SrcParentUpdatedAt,
			&row.TrgID,
			&row.TrgKind,
			&row.TrgCurrency,
			&row.TrgName,
			&row.TrgColor,
			&row.TrgIcon,
			&row.TrgArchivedAt,
			&row.TrgCreatedAt,
			&row.TrgUpdatedAt,
			&row.TrgParentID,
			&row.TrgParentKind,
			&row.TrgParentCurrency,
			&row.TrgParentName,
			&row.TrgParentColor,
			&row.TrgParentIcon,
			&row.TrgParentArchivedAt,
			&row.TrgParentCreatedAt,
			&row.TrgParentUpdatedAt,
		)
		if err != nil {
			return res, errors.Join(errors.New("failed to scan query row"), err)
		}

		res = append(res, base.BuildTransactions(row))
	}

	return res, nil
}

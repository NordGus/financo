package pending_query

import (
	"context"
	"errors"
	"financo/lib/nullable"
	base "financo/server/transactions/queries"
	"financo/server/transactions/types/response"
	"financo/server/types/queries"
	"financo/services/postgresql_database"
	"fmt"
	"time"
)

type query struct {
	from       nullable.Type[time.Time]
	to         nullable.Type[time.Time]
	accounts   []int64
	categories []int64
}

func New(
	from nullable.Type[time.Time],
	to nullable.Type[time.Time],
	accounts []int64,
	categories []int64,
) queries.Query[[]response.Detailed] {
	return &query{
		from:       from,
		to:         to,
		accounts:   accounts,
		categories: categories,
	}
}

func (q *query) Find(ctx context.Context) ([]response.Detailed, error) {
	var (
		query    = base.BaseQueryList + " AND tr.executed_at IS NULL"
		res      = make([]response.Detailed, 0, 20)
		filters  = make([]any, 0, 3)
		filter   = 1
		postgres = postgresql_database.New()
	)

	conn, err := postgres.Conn(ctx)
	if err != nil {
		return res, errors.Join(errors.New("failed to retrieve database connection"), err)
	}
	defer conn.Close()

	if q.from.Valid && q.to.Valid {
		filters = append(filters, q.from.Val, q.to.Val)
		query += fmt.Sprintf(" AND (tr.executed_at BETWEEN $%d AND $%d)", filter, filter+1)
		filter += 2
	} else if q.from.Valid {
		filters = append(filters, q.from.Val)
		query += fmt.Sprintf(" AND tr.executed_at >= $%d", filter)
		filter++
	} else if q.to.Valid {
		filters = append(filters, q.to.Val)
		query += fmt.Sprintf(" AND tr.executed_at <= $%d", filter)
		filter++
	}

	if len(q.accounts) > 0 {
		query += fmt.Sprintf(" AND (tr.source_id = ANY ($%d) OR tr.target_id = ANY ($%d))", filter, filter)
		filters = append(filters, q.accounts)
		filter++
	}

	if len(q.categories) > 0 {
		query += fmt.Sprintf(" AND (tr.source_id = ANY ($%d) OR tr.target_id = ANY ($%d))", filter, filter)
		filters = append(filters, q.categories)
		filter++
	}

	rows, err := conn.QueryContext(ctx, query, filters...)
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

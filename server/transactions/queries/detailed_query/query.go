package detailed_query

import (
	"context"
	"errors"
	"financo/core/domain/queries"
	base "financo/server/transactions/queries"
	"financo/server/transactions/types/response"
	"financo/services/postgresql_database"
)

type query struct {
	id int64
}

func New(id int64) queries.Query[response.Detailed] {
	return &query{
		id: id,
	}
}

func (q *query) Find(ctx context.Context) (response.Detailed, error) {
	var (
		query    = base.BaseQueryList + " AND tr.id = $1"
		postgres = postgresql_database.New()

		res response.Detailed
		row base.BaseQueryListRow
	)

	conn, err := postgres.Conn(ctx)
	if err != nil {
		return res, errors.Join(errors.New("failed to retrieve database connection"), err)
	}
	defer conn.Close()

	err = conn.QueryRowContext(ctx, query, q.id).Scan(
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
		return res, errors.Join(errors.New("failed to execute ans scan query"), err)
	}

	return base.BuildTransactions(row), nil
}

package list_query

import (
	"context"
	"errors"
	"financo/server/accounts/types/filters"
	"financo/server/accounts/types/response"
	"financo/server/types/queries"

	"github.com/jackc/pgx/v5/pgxpool"
)

type query struct {
	filters filters.List
	conn    *pgxpool.Conn
}

func New(filters filters.List, conn *pgxpool.Conn) queries.Query[[]response.Detailed] {
	return &query{
		filters: filters,
		conn:    conn,
	}
}

func (c *query) Find(ctx context.Context) ([]response.Detailed, error) {
	return []response.Detailed{}, errors.New("not implemented")
}

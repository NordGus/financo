package detailed_children_query

import (
	"context"
	"errors"
	"financo/server/accounts/types/response"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Query interface {
	Find(ctx context.Context) ([]response.DetailedChild, error)
}

type query struct {
	parentID int64
	conn     *pgxpool.Conn
}

func New(parentID int64, conn *pgxpool.Conn) Query {
	return &query{
		parentID: parentID,
		conn:     conn,
	}
}

func (q *query) Find(ctx context.Context) ([]response.DetailedChild, error) {
	children := make([]response.DetailedChild, 0, 10)

	return children, errors.New("not implemented")
}

package detailed_query

import (
	"context"
	"errors"
	"financo/server/accounts/types/response"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Query interface {
	Find(ctx context.Context) (response.Detailed, error)
}

type query struct {
	id   int64
	conn *pgxpool.Conn
}

func New(id int64, conn *pgxpool.Conn) Query {
	return &query{
		id:   id,
		conn: conn,
	}
}

func (q *query) Find(ctx context.Context) (response.Detailed, error) {
	res := response.Detailed{}

	return res, errors.New("not implemented")
}

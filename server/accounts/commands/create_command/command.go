package create_command

import (
	"context"
	"financo/server/accounts/types/request"
	"financo/server/accounts/types/response"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Command interface {
	Run(context.Context) (response.Created, error)
}

type command struct {
	req       request.Create
	conn      *pgxpool.Conn
	timestamp time.Time
}

func New(conn *pgxpool.Conn, req request.Create) Command {
	return &command{
		req:       req,
		conn:      conn,
		timestamp: time.Now().UTC(),
	}
}

func (c *command) Run(ctx context.Context) (response.Created, error) {
	return response.Created{}, nil
}

package update_command

import (
	"financo/server/accounts/types/request"
	"financo/server/accounts/types/response"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Command interface {
	Run() (response.Detailed, error)
}

type command struct {
	req  request.Update
	conn *pgxpool.Conn
}

func New(conn *pgxpool.Conn, req request.Update) Command {
	return &command{
		req:  req,
		conn: conn,
	}
}

func (c *command) Run() (response.Detailed, error) {
	return response.Detailed{}, nil
}

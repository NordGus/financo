package get_session_command

import (
	"context"
	"financo/core/domain/commands"
	"financo/core/domain/repositories"
	"financo/core/domain/requests"
	"financo/models/session"
	"time"
)

const (
	duration = time.Hour * 7
)

type command struct {
	req  requests.Session
	repo repositories.Session
}

func New(req requests.Session, repo repositories.Session) commands.Command[session.Record] {
	return &command{
		req:  req,
		repo: repo,
	}
}

func (c *command) Run(ctx context.Context) (session.Record, error) {
	record, err := c.repo.Find(ctx, c.req.ID)
	if err != nil {
		return record, err
	}

	return record, nil
}

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
	var (
		id = c.req.ID

		record session.Record
		err    error
	)

	// Create a new session in case the user doesn't has one
	if !id.Valid {
		// session creation is delegated to the repository so the infrastructure
		// handles session ID definition.
		record, err = c.repo.Create(ctx, duration)
		if err != nil {
			return record, err
		}
	}

	record, err = c.repo.Find(ctx, id.OrElse(record.ID))
	if err != nil {
		return record, err
	}

	return record, nil
}

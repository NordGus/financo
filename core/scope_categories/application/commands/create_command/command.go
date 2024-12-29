package create_command

import (
	"context"
	"financo/core/domain/commands"
	"financo/core/scope_categories/domain/brokers"
	"financo/core/scope_categories/domain/messages"
	"financo/core/scope_categories/domain/repositories"
	"financo/core/scope_categories/domain/requests"
	"financo/core/scope_categories/domain/responses"
	"financo/models/account"
	"fmt"
	"time"
)

type command struct {
	req    requests.Create
	repo   repositories.CreateRepository
	broker brokers.Created
}

func New(
	req requests.Create,
	repo repositories.CreateRepository,
	broker brokers.Created,
) commands.Command[responses.Created] {
	return &command{
		req:    req,
		repo:   repo,
		broker: broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Created, error) {
	var (
		timestamp = time.Now().UTC()

		res responses.Created
	)

	if !account.IsExternal(c.req.Kind) {
		return res, fmt.Errorf("create_command: invalid kind %s", res.Kind)
	}

	record := c.req.ToRecord(timestamp)
	children := c.req.ToChildrenRecords(timestamp)

	record, err := c.repo.Save(ctx, record, children)
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.Created{Record: record})
	if err != nil {
		return res, err
	}

	return responses.Created{
		ID:    record.ID,
		Name:  record.Name,
		Kind:  record.Kind,
		Color: record.Color,
		Icon:  record.Icon,
	}, nil
}

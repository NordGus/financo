package delete_command

import (
	"context"
	"financo/core/domain/commands"
	"financo/core/scope_categories/domain/brokers"
	"financo/core/scope_categories/domain/messages"
	"financo/core/scope_categories/domain/repositories"
	"financo/core/scope_categories/domain/requests"
	"financo/core/scope_categories/domain/responses"
	"financo/lib/nullable"
	"fmt"
	"time"
)

type command struct {
	req    requests.Delete
	repo   repositories.DeleteRepository
	broker brokers.Deleted
}

func New(
	req requests.Delete,
	repo repositories.DeleteRepository,
	broker brokers.Deleted,
) commands.Command[responses.Deleted] {
	return &command{
		req:    req,
		repo:   repo,
		broker: broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Deleted, error) {
	var (
		timestamp = time.Now().UTC()

		res responses.Deleted
	)

	record, err := c.repo.Find(ctx, c.req.ID)
	if err != nil {
		return res, err
	}

	if record.Account.ID <= 0 {
		return res, fmt.Errorf("delete_command: category id=(%d) not found", record.Account.ID)
	}

	record.Account.DeletedAt = nullable.New(timestamp)
	record.Account.UpdatedAt = timestamp

	for i := 0; i < len(record.Children); i++ {
		record.Children[i].DeletedAt = nullable.New(timestamp)
		record.Children[i].UpdatedAt = timestamp
	}

	err = c.repo.SoftDelete(ctx, record)
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.Deleted{Record: record.Account})
	if err != nil {
		return res, err
	}

	return responses.Deleted{
		ID:    record.Account.ID,
		Name:  record.Account.Name,
		Kind:  record.Account.Kind,
		Color: record.Account.Color,
		Icon:  record.Account.Icon,
	}, nil
}

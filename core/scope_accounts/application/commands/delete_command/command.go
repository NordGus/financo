package delete_command

import (
	"context"
	"financo/core/domain/commands"
	"financo/core/scope_accounts/domain/brokers"
	"financo/core/scope_accounts/domain/messages"
	"financo/core/scope_accounts/domain/repositories"
	"financo/core/scope_accounts/domain/requests"
	"financo/core/scope_accounts/domain/responses"
	"financo/lib/nullable"
	"time"
)

type command struct {
	req    requests.Delete
	repo   repositories.DeleteAccountRepository
	broker brokers.DeletedBroker
}

func New(
	req requests.Delete,
	repo repositories.DeleteAccountRepository,
	broker brokers.DeletedBroker,
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

	record.DeletedAt = nullable.New(timestamp)
	record.UpdatedAt = timestamp

	err = c.repo.SoftDelete(ctx, record)
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.Deleted{Record: record})
	if err != nil {
		return res, err
	}

	return responses.Deleted{
		ID:    record.ID,
		Name:  record.Name,
		Kind:  record.Kind,
		Color: record.Color,
		Icon:  record.Icon,
	}, nil
}

package delete_command

import (
	"context"
	"financo/core/scope_accounts/domain/brokers"
	"financo/core/scope_accounts/domain/messages"
	"financo/core/scope_accounts/domain/repositories"
	"financo/core/scope_accounts/domain/requests"
	"financo/core/scope_accounts/domain/responses"
	"financo/server/types/commands"
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
	record, err := c.repo.SoftDelete(ctx, c.req.ID)
	if err != nil {
		return responses.Deleted{}, err
	}

	res := responses.Deleted{ID: record.ID, Name: record.Name}

	err = c.broker.Publish(messages.Deleted{Record: record})
	if err != nil {
		return res, err
	}

	return res, nil
}

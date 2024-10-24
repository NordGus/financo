package create_command

import (
	"context"
	"financo/core/domain/commands"
	"financo/core/scope_accounts/domain/brokers"
	"financo/core/scope_accounts/domain/messages"
	"financo/core/scope_accounts/domain/repositories"
	"financo/core/scope_accounts/domain/requests"
	"financo/core/scope_accounts/domain/responses"
	"time"
)

type command struct {
	req    requests.Create
	repo   repositories.CreateAccountRepository
	broker brokers.CreatedBroker
}

func New(
	req requests.Create,
	repo repositories.CreateAccountRepository,
	broker brokers.CreatedBroker,
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
		args      = repositories.CreateAccountSaveArgs{
			Record:  requests.CreateToAccountRecord(c.req, timestamp),
			History: requests.CreateToSystemHistoricAccountRecord(c.req, timestamp),
		}
	)

	record, err := c.repo.Save(ctx, args)
	if err != nil {
		return responses.Created{}, err
	}

	err = c.broker.Publish(messages.Created{Record: record})
	if err != nil {
		return responses.Created{}, err
	}

	return responses.Created{ID: record.ID, Name: record.Name}, nil
}

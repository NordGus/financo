package create_command

import (
	"context"
	"financo/core/accounts/domain/brokers"
	"financo/core/accounts/domain/messages"
	"financo/core/accounts/domain/repositories"
	"financo/server/accounts/types/request"
	"financo/server/accounts/types/response"
	"financo/server/types/commands"
	"financo/server/types/generic/nullable"
	"financo/server/types/records/account"
	"financo/server/types/shared/icon"
)

type command struct {
	req    request.Create
	repo   repositories.CreateAccountRepository
	broker brokers.CreatedBroker
}

func New(
	req request.Create,
	repo repositories.CreateAccountRepository,
	broker brokers.CreatedBroker,
) commands.Command[response.Created] {
	return &command{
		req:    req,
		repo:   repo,
		broker: broker,
	}
}

func (c *command) Run(ctx context.Context) (response.Created, error) {
	args := repositories.CreateAccountSaveArgs{
		Record:  c.buildRecord(),
		History: c.buildHistory(),
	}

	record, err := c.repo.Save(ctx, args)
	if err != nil {
		return response.Created{}, err
	}

	err = c.broker.Publish(messages.Created{Record: record})
	if err != nil {
		return response.Created{}, err
	}

	return response.Created{ID: record.ID, Name: record.Name}, nil
}

func (c *command) buildRecord() account.Record {
	record := account.Record{
		ID:          -1,
		Kind:        c.req.Kind,
		Currency:    c.req.Currency,
		Name:        c.req.Name,
		Description: c.req.Description,
		Color:       c.req.Color,
		Icon:        c.req.Icon,
		Capital:     0,
	}

	if account.IsDebt(c.req.Kind) {
		record.Capital = c.req.Capital
	}

	return record
}

func (c *command) buildHistory() nullable.Type[account.Record] {
	if !account.IsExternal(c.req.Kind) {
		return nullable.Type[account.Record]{}
	}

	return nullable.New(account.Record{
		ID: -1,
		// ParentID will be added by repository
		Kind:        account.SystemHistoric,
		Currency:    c.req.Currency,
		Name:        "History",
		Description: nullable.New("This account was created by the system to represent the lost balance history of the parent account. DO NOT MODIFY NOR DELETE"),
		Color:       "#8c8c8c",
		Icon:        icon.Base,
		Capital:     0,
	})
}

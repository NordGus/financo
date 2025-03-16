package create_command

import (
	"context"
	"financo/core/domain/commands"
	"financo/core/scope_accounts/domain/brokers"
	"financo/core/scope_accounts/domain/messages"
	"financo/core/scope_accounts/domain/repositories"
	"financo/core/scope_accounts/domain/requests"
	"financo/core/scope_accounts/domain/responses"
	"financo/models/account"
	"fmt"
	"time"
)

type command struct {
	req    requests.Create
	create repositories.CreateAccountRepository
	broker brokers.Created
}

func New(
	req requests.Create, create repositories.CreateAccountRepository, broker brokers.Created,
) commands.Command[responses.Listed] {
	return &command{
		req:    req,
		create: create,
		broker: broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Listed, error) {
	var res responses.Listed

	if account.IsExternal(c.req.Kind) {
		return res, fmt.Errorf("create_command: invalid account kind %s", c.req.Kind)
	}

	var (
		timestamp = time.Now().UTC()
		args      = repositories.CreateAccountSaveArgs{
			Record:             c.req.Record(timestamp),
			History:            c.req.HistoryRecord(timestamp),
			HistoryTransaction: c.req.HistoryTransaction(timestamp),
		}
	)

	// Prevents the creation of a zero capital debt in the system.
	if account.IsPassive(args.Record.Kind) && args.Record.Capital == 0 {
		return res, fmt.Errorf(
			"create_command: invalid capital %d for kind %s, reason: can't be zero",
			c.req.Capital,
			c.req.Kind,
		)
	}

	record, err := c.create.Save(ctx, args)
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.Created{Record: record})
	if err != nil {
		return res, err
	}

	return responses.AccountRecordToListed(record), nil
}

package create_command

import (
	"context"
	"financo/core/domain/commands"
	core_repos "financo/core/domain/repositories"
	"financo/core/scope_transactions/domain/brokers"
	"financo/core/scope_transactions/domain/errors"
	"financo/core/scope_transactions/domain/messages"
	"financo/core/scope_transactions/domain/repositories"
	"financo/core/scope_transactions/domain/requests"
	"financo/core/scope_transactions/domain/responses"
	"financo/models/account"
	"time"
)

type command struct {
	req      requests.Create
	accounts core_repos.Account
	create   repositories.CreateTransactionRepository
	broker   brokers.Created
}

func New(
	req requests.Create,
	accounts core_repos.Account,
	create repositories.CreateTransactionRepository,
	broker brokers.Created,
) commands.Command[responses.Detailed] {
	return &command{
		req:      req,
		accounts: accounts,
		create:   create,
		broker:   broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Detailed, error) {
	var (
		timestamp = time.Now().UTC()
		record    = c.req.ToTransactionRecord(timestamp)

		source account.Record
		target account.Record
		res    responses.Detailed
	)

	if record.SourceID == record.TargetID {
		return res, errors.ErrCircularTransaction
	}

	source, err := c.accounts.Find(ctx, record.SourceID)
	if err != nil {
		return res, err
	}

	target, err = c.accounts.Find(ctx, record.TargetID)
	if err != nil {
		return res, err
	}

	if target.Currency == source.Currency {
		record.TargetAmount = record.SourceAmount
	}

	record, err = c.create.Save(ctx, record)
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.Created{Record: record})
	if err != nil {
		return res, err
	}

	return responses.RecordToDetailed(record), nil
}

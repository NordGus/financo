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
	req     requests.Delete
	destroy repositories.DeleteAccountRepository
	broker  brokers.Deleted
}

func New(
	req requests.Delete,
	destroy repositories.DeleteAccountRepository,
	broker brokers.Deleted,
) commands.Command[responses.Listed] {
	return &command{
		req:     req,
		destroy: destroy,
		broker:  broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Listed, error) {
	var (
		timestamp = time.Now().UTC()

		res responses.Listed
	)

	record, err := c.destroy.Find(ctx, c.req.ID)
	if err != nil {
		return res, err
	}

	record.DeletedAt = nullable.New(timestamp)
	record.UpdatedAt = timestamp

	err = c.destroy.SoftDelete(ctx, record)
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.Deleted{Record: record})
	if err != nil {
		return res, err
	}

	return responses.AccountRecordToListed(record), nil
}

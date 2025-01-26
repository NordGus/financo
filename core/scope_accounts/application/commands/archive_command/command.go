package archive_command

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
	req      requests.Archive
	accounts repositories.AccountRepository
	archival repositories.ArchivalRepository
	broker   brokers.Archived
}

func New(
	req requests.Archive,
	accounts repositories.AccountRepository,
	archival repositories.ArchivalRepository,
	broker brokers.Archived,
) commands.Command[responses.Listed] {
	return &command{
		req:      req,
		accounts: accounts,
		archival: archival,
		broker:   broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Listed, error) {
	var (
		timestamp = time.Now().UTC()
		at        = nullable.New(timestamp)

		res responses.Listed
	)

	err := c.archival.Archive(ctx, c.req.ID, at, timestamp)
	if err != nil {
		return res, err
	}

	record, err := c.accounts.Find(ctx, c.req.ID)
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.Archived{Record: record})
	if err != nil {
		return res, err
	}

	return responses.AccountRecordToListed(record), nil
}

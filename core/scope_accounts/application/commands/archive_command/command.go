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
	req          requests.Archive
	repo         repositories.AccountRepository
	archivalRepo repositories.ArchivalRepository
	broker       brokers.ArchivedBroker
}

func New(
	req requests.Archive,
	repo repositories.AccountRepository,
	archivalRepo repositories.ArchivalRepository,
	broker brokers.ArchivedBroker,
) commands.Command[responses.Archived] {
	return &command{
		req:          req,
		repo:         repo,
		archivalRepo: archivalRepo,
		broker:       broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Archived, error) {
	var (
		timestamp = time.Now().UTC()
		at        = nullable.New(timestamp)

		res responses.Archived
	)

	err := c.archivalRepo.Archive(ctx, c.req.ID, at, timestamp)
	if err != nil {
		return res, err
	}

	record, err := c.repo.Find(ctx, c.req.ID)
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.Archived{Record: record})
	if err != nil {
		return res, err
	}

	return responses.Archived{
		ID:    record.ID,
		Name:  record.Name,
		Kind:  record.Kind,
		Color: record.Color,
		Icon:  record.Icon,
	}, nil
}

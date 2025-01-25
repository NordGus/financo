package archive_command

import (
	"context"
	"financo/core/domain/commands"
	"financo/core/scope_categories/domain/brokers"
	"financo/core/scope_categories/domain/messages"
	"financo/core/scope_categories/domain/repositories"
	"financo/core/scope_categories/domain/requests"
	"financo/core/scope_categories/domain/responses"
	"time"
)

type command struct {
	req          requests.Archive
	repo         repositories.CategoryRepository
	archivalRepo repositories.ArchivalRepository
	broker       brokers.Archived
}

func New(
	req requests.Archive,
	repo repositories.CategoryRepository,
	archivalRepo repositories.ArchivalRepository,
	broker brokers.Archived,
) commands.Command[responses.Listed] {
	return &command{
		req:          req,
		repo:         repo,
		archivalRepo: archivalRepo,
		broker:       broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Listed, error) {
	var (
		timestamp = time.Now().UTC()

		res responses.Listed
	)

	err := c.archivalRepo.Archive(ctx, c.req.ID, timestamp)
	if err != nil {
		return res, err
	}

	record, err := c.repo.Find(ctx, c.req.ID)
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.Archived{Record: record.Parent})
	if err != nil {
		return res, err
	}

	return responses.NewListedFromCategoryRecord(record), nil
}

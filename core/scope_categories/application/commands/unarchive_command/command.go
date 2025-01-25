package unarchive_command

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
	req          requests.Unarchive
	repo         repositories.CategoryRepository
	archivalRepo repositories.ArchivalRepository
	broker       brokers.Unarchived
}

func New(
	req requests.Unarchive,
	repo repositories.CategoryRepository,
	archivalRepo repositories.ArchivalRepository,
	broker brokers.Unarchived,
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

	err := c.archivalRepo.Unarchive(ctx, c.req.ID, timestamp)
	if err != nil {
		return res, err
	}

	record, err := c.repo.Find(ctx, c.req.ID)
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.Unarchived{Record: record.Parent})
	if err != nil {
		return res, err
	}

	return responses.NewListedFromCategoryRecord(record), nil
}

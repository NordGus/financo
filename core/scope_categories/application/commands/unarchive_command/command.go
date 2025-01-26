package unarchive_command

import (
	"context"
	"financo/core/domain/commands"
	"financo/core/scope_categories/domain/brokers"
	"financo/core/scope_categories/domain/messages"
	"financo/core/scope_categories/domain/repositories"
	"financo/core/scope_categories/domain/requests"
	"financo/core/scope_categories/domain/responses"
	"fmt"
	"time"
)

type command struct {
	req        requests.Unarchive
	categories repositories.CategoryRepository
	archival   repositories.UnarchiveRepository
	broker     brokers.Unarchived
}

func New(
	req requests.Unarchive,
	categories repositories.CategoryRepository,
	archival repositories.UnarchiveRepository,
	broker brokers.Unarchived,
) commands.Command[responses.Listed] {
	return &command{
		req:        req,
		categories: categories,
		archival:   archival,
		broker:     broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Listed, error) {
	var (
		timestamp = time.Now().UTC()

		res responses.Listed
	)

	record, err := c.categories.Find(ctx, c.req.ID)
	if err != nil {
		return res, err
	}

	if record.Parent.ParentID.Valid {
		return res, fmt.Errorf("unarchive_command: category id=(%d) is not a parent category", c.req.ID)
	}

	if record.Parent.ID <= 0 {
		return res, fmt.Errorf("unarchive_command: category id=(%d) not found", c.req.ID)
	}

	record, err = c.archival.Unarchive(ctx, record, timestamp)
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.Unarchived{Record: record.Parent})
	if err != nil {
		return res, err
	}

	return responses.NewListedFromCategoryRecord(record), nil
}

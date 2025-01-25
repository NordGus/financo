package create_child_command

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
	req        requests.CreateChildForParent
	categories repositories.CategoryRepository
	repo       repositories.CreateRepository
	broker     brokers.Created
}

func New(
	req requests.CreateChildForParent,
	categories repositories.CategoryRepository,
	repo repositories.CreateRepository,
	broker brokers.Created,
) commands.Command[responses.ListedChild] {
	return &command{
		req:        req,
		categories: categories,
		repo:       repo,
		broker:     broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.ListedChild, error) {
	var (
		timestamp = time.Now().UTC()

		res responses.ListedChild
	)

	cat, err := c.categories.Find(ctx, c.req.ParentID)
	if err != nil {
		return res, err
	}

	record := c.req.ToRecord(cat.Parent, timestamp)

	record, err = c.repo.SaveChild(ctx, record)
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.Created{Record: record})
	if err != nil {
		return res, err
	}

	return responses.NewListedChildFromAccountRecord(record), nil
}

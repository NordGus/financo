package update_command

import (
	"context"
	"financo/core/domain/commands"
	"financo/core/scope_categories/domain/brokers"
	"financo/core/scope_categories/domain/messages"
	"financo/core/scope_categories/domain/models/category"
	"financo/core/scope_categories/domain/repositories"
	"financo/core/scope_categories/domain/requests"
	"financo/core/scope_categories/domain/responses"
	"fmt"
	"time"
)

type command struct {
	req    requests.Update
	repo   repositories.UpdateRepository
	broker brokers.Updated
}

func New(
	req requests.Update,
	repo repositories.UpdateRepository,
	broker brokers.Updated,
) commands.Command[responses.Listed] {
	return &command{
		req:    req,
		repo:   repo,
		broker: broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Listed, error) {
	var (
		timestamp = time.Now().UTC()

		res     responses.Listed
		current category.Record
	)

	previous, err := c.repo.Find(ctx, c.req.ID)
	if err != nil {
		return res, err
	}

	if previous.Parent.ParentID.Valid {
		return res, fmt.Errorf("update_command: (%d) is not a parent category", c.req.ID)
	}

	current.Parent = c.req.ToRecord(previous.Parent, timestamp)
	current.Children = previous.Children

	err = c.repo.Save(ctx, current)
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.Updated{Current: current.Parent, Previous: previous.Parent})
	if err != nil {
		return res, err
	}

	return responses.NewListedFromCategoryRecord(current), nil
}

package update_child_command

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
	req        requests.UpdateChild
	categories repositories.CategoryRepository
	update     repositories.UpdateRepository
	broker     brokers.Updated
}

func New(
	req requests.UpdateChild,
	categories repositories.CategoryRepository,
	update repositories.UpdateRepository,
	broker brokers.Updated,
) commands.Command[responses.ListedChild] {
	return &command{
		req:        req,
		categories: update,
		update:     update,
		broker:     broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.ListedChild, error) {
	var (
		timestamp = time.Now().UTC()

		res     responses.ListedChild
		current category.Record
	)

	parent, err := c.categories.Find(ctx, c.req.ParentID)
	if err != nil {
		return res, err
	}

	previous, err := c.update.Find(ctx, c.req.ID)
	if err != nil {
		return res, err
	}

	if parent.Parent.ID != previous.Parent.ParentID.Val {
		return res, fmt.Errorf("update_child_command: (%d) is not the parent of (%d)", c.req.ParentID, c.req.ID)
	}

	current.Parent = c.req.ToRecord(previous.Parent, timestamp)
	current.Children = previous.Children

	err = c.update.Save(ctx, current)
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.Updated{Current: current.Parent, Previous: previous.Parent})
	if err != nil {
		return res, err
	}

	return responses.NewListedChildFromAccountRecord(current.Parent), nil
}

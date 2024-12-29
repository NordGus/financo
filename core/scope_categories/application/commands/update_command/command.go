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
) commands.Command[responses.Updated] {
	return &command{
		req:    req,
		repo:   repo,
		broker: broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Updated, error) {
	var (
		timestamp = time.Now().UTC()

		res     responses.Updated
		current category.Record
	)

	previous, err := c.repo.Find(ctx, c.req.ID)
	if err != nil {
		return res, err
	}

	current.Account = c.req.ToRecord(previous.Account, timestamp)
	current.Children = c.req.ToChildrenRecords(previous.Children, previous.Account, timestamp)

	err = c.repo.Save(ctx, current)
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.Updated{Current: current.Account, Previous: previous.Account})
	if err != nil {
		return res, err
	}

	return responses.Updated{
		ID:    current.Account.ID,
		Name:  current.Account.Name,
		Kind:  current.Account.Kind,
		Color: current.Account.Color,
		Icon:  current.Account.Icon,
	}, nil
}

package update_command

import (
	"context"
	"financo/core/domain/commands"
	"financo/core/scope_savings_goals/domain/brokers"
	"financo/core/scope_savings_goals/domain/messages"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/core/scope_savings_goals/domain/requests"
	"financo/core/scope_savings_goals/domain/responses"
	"time"
)

type command struct {
	req    requests.Update
	goal   repositories.SavingsGoalRepository
	update repositories.UpdateRepository
	broker brokers.Updated
}

func New(
	req requests.Update,
	goal repositories.SavingsGoalRepository,
	update repositories.UpdateRepository,
	broker brokers.Updated,
) commands.Command[responses.Updated] {
	return &command{
		req:    req,
		goal:   goal,
		update: update,
		broker: broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Updated, error) {
	var (
		timestamp = time.Now().UTC()

		res responses.Updated
	)

	prev, err := c.goal.Find(ctx, c.req.ID)
	if err != nil {
		return res, err
	}

	current := c.req.UpdateRecord(prev, timestamp)

	err = c.update.Save(ctx, current)
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.Updated{Previous: prev, Current: current})
	if err != nil {
		return res, err
	}

	res = responses.NewUpdated(current)

	return res, nil
}

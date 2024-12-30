package mark_as_achieved_command

import (
	"context"
	"financo/core/domain/commands"
	"financo/core/scope_savings_goals/domain/brokers"
	"financo/core/scope_savings_goals/domain/errors"
	"financo/core/scope_savings_goals/domain/messages"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/core/scope_savings_goals/domain/requests"
	"financo/core/scope_savings_goals/domain/responses"
	"time"
)

type command struct {
	req    requests.MarkAsAchieved
	goal   repositories.SavingsGoalRepository
	update repositories.UpdateRepository
	broker brokers.MarkedAsAchieved
}

func New(
	req requests.MarkAsAchieved,
	goal repositories.SavingsGoalRepository,
	update repositories.UpdateRepository,
	broker brokers.MarkedAsAchieved,
) commands.Command[responses.MarkedAsAchieved] {
	return &command{
		req:    req,
		goal:   goal,
		update: update,
		broker: broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.MarkedAsAchieved, error) {
	var (
		timestamp = time.Now().UTC()

		res responses.MarkedAsAchieved
	)

	record, err := c.goal.Find(ctx, c.req.ID)
	if err != nil {
		return res, err
	}

	record = c.req.UpdateRecord(record, timestamp)

	if record.Settings.Saved < record.Settings.Target {
		return res, errors.ErrGoalHasNotBeenAchieved
	}

	err = c.update.Save(ctx, record)
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.MarkedAsAchieved{Record: record})
	if err != nil {
		return res, err
	}

	res = responses.NewMarkedAsAchieved(record)

	return res, nil
}

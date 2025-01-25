package delete_command

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
	req    requests.Delete
	goal   repositories.SavingsGoalRepository
	delete repositories.UpdateRepository
	broker brokers.Deleted
}

func New(
	req requests.Delete,
	goal repositories.SavingsGoalRepository,
	delete repositories.UpdateRepository,
	broker brokers.Deleted,
) commands.Command[responses.Deleted] {
	return &command{
		req:    req,
		goal:   goal,
		delete: delete,
		broker: broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Deleted, error) {
	var (
		timestamp = time.Now().UTC()

		res responses.Deleted
	)

	record, err := c.goal.Find(ctx, c.req.ID)
	if err != nil {
		return res, err
	}

	record = c.req.UpdateRecord(record, timestamp)

	err = c.delete.Save(ctx, record)
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.Deleted{Record: record})
	if err != nil {
		return res, err
	}

	res = responses.NewDeleted(record)

	return res, nil
}

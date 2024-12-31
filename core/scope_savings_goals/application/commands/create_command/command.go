package create_command

import (
	"context"
	"financo/core/domain/commands"
	"financo/core/scope_savings_goals/domain/brokers"
	"financo/core/scope_savings_goals/domain/filters"
	"financo/core/scope_savings_goals/domain/messages"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/core/scope_savings_goals/domain/requests"
	"financo/core/scope_savings_goals/domain/responses"
	"time"
)

type command struct {
	req    requests.Create
	goals  repositories.SavingsGoalsRepository
	create repositories.CreateRepository
	broker brokers.Created
}

func New(
	req requests.Create,
	goals repositories.SavingsGoalsRepository,
	create repositories.CreateRepository,
	broker brokers.Created,
) commands.Command[responses.Created] {
	return &command{
		req:    req,
		goals:  goals,
		create: create,
		broker: broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Created, error) {
	var (
		timestamp = time.Now().UTC()
		record    = c.req.ToRecord(timestamp)
		goalsF    = filters.SavingsGoals{Currency: c.req.Currency}

		res responses.Created
	)

	goals, err := c.goals.Where(ctx, goalsF)
	if err != nil {
		return res, err
	}

	record.Settings.Position = int16(len(goals)) + 1

	record, err = c.create.Save(ctx, record)
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.Created{Record: record})
	if err != nil {
		return res, err
	}

	return responses.NewCreated(record), nil
}

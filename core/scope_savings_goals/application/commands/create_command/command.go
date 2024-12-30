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
	"financo/lib/currency"
	"time"
)

type command struct {
	req     requests.Create
	savings repositories.Savings
	goals   repositories.SavingsGoals
	create  repositories.CreateRepository
	broker  brokers.Created
}

func New(
	req requests.Create,
	savings repositories.Savings,
	goals repositories.SavingsGoals,
	create repositories.CreateRepository,
	broker brokers.Created,
) commands.Command[responses.Created] {
	return &command{
		req:     req,
		savings: savings,
		goals:   goals,
		create:  create,
		broker:  broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Created, error) {
	var (
		timestamp = time.Now().UTC()
		record    = c.req.ToRecord(timestamp)
		goalsF    = filters.SavingsGoals{Currency: c.req.Currency}
		savingsF  = filters.Savings{Currencies: []currency.Type{c.req.Currency}}

		res responses.Created
	)

	savings, err := c.savings.Where(ctx, savingsF)
	if err != nil {
		return res, err
	}

	goals, err := c.goals.Where(ctx, goalsF)
	if err != nil {
		return res, err
	}

	record.Settings.Position = int16(len(goals)) + 1

	goals = append(goals, record)
	saved := savings[c.req.Currency]
	last := len(goals) - 1

	for i := 0; i < len(goals); i++ {
		if saved < goals[i].Settings.Target && saved > 0 {
			goals[i].Settings.Saved = saved
			saved = 0
			continue
		}

		if saved <= 0 {
			goals[i].Settings.Saved = 0
			continue
		}

		goals[i].Settings.Saved = goals[i].Settings.Target
		saved -= goals[i].Settings.Target
	}

	record, err = c.create.Save(ctx, goals[last])
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.Created{Record: record})
	if err != nil {
		return res, err
	}

	return responses.NewCreated(record), nil
}

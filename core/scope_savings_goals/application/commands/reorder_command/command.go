package reorder_command

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
	"financo/models/achievement/savings_goal"
	"time"
)

type command struct {
	req     requests.Reorder
	goals   repositories.ReorderRepository
	savings repositories.SavingsRepository
	update  repositories.UpdateRepository
	broker  brokers.Reordered
}

func New(
	req requests.Reorder,
	goals repositories.ReorderRepository,
	savings repositories.SavingsRepository,
	update repositories.UpdateRepository,
	broker brokers.Reordered,
) commands.Command[responses.Reordered] {
	return &command{
		req:     req,
		goals:   goals,
		savings: savings,
		update:  update,
		broker:  broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Reordered, error) {
	var (
		timestamp = time.Now().UTC()

		savings int64
		res     responses.Reordered
	)

	record, err := c.goals.Find(ctx, c.req.ID)
	if err != nil {
		return res, err
	}

	previous, err := c.goals.Where(ctx, filters.SavingsGoals{Currency: record.Settings.Currency})
	if err != nil {
		return res, err
	}

	goals := make([]savings_goal.Record, 0, len(previous))

	// reordering array
	for i := 0; i < len(previous); i++ {
		position := int64(i + 1)

		if c.req.From == position {
			continue
		}

		if c.req.To == position {
			goals = append(goals, record)
		}

		goals = append(goals, previous[i])
	}

	s, err := c.savings.Where(ctx, filters.Savings{Currencies: []currency.Type{record.Settings.Currency}})
	if err != nil {
		return res, err
	}

	savings = s[record.Settings.Currency]
	updated := make([]savings_goal.Record, 0, len(goals))

	// recalculating position and saved
	for i := 0; i < len(goals); i++ {
		goal := goals[i]

		goal.UpdatedAt = timestamp
		goal.Settings.Position = int16(i + 1)

		if savings < goal.Settings.Target && savings > 0 {
			goal.Settings.Saved = savings
			savings = 0
			updated = append(updated, goal)

			continue
		}

		if savings <= 0 {
			goal.Settings.Saved = 0
			updated = append(updated, goal)

			continue
		}

		goal.Settings.Saved = goal.Settings.Target
		savings -= goal.Settings.Target
		updated = append(updated, goal)
	}

	err = c.update.SaveMultiple(ctx, updated)
	if err != nil {
		return res, err
	}

	err = c.broker.Publish(messages.Reordered{Currency: record.Settings.Currency})
	if err != nil {
		return res, err
	}

	res = responses.NewReordered(record.Settings.Currency, updated)

	return res, nil
}

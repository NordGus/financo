package reorder_command

import (
	"cmp"
	"context"
	"financo/core/domain/commands"
	"financo/core/scope_savings_goals/domain/brokers"
	"financo/core/scope_savings_goals/domain/filters"
	"financo/core/scope_savings_goals/domain/messages"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/core/scope_savings_goals/domain/requests"
	"financo/core/scope_savings_goals/domain/responses"
	"financo/core/scope_savings_goals/infrastructure/lock"
	"financo/lib/currency"
	"financo/models/achievement/savings_goal"
	"slices"
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
) commands.Command[responses.Listed] {
	return &command{
		req:     req,
		goals:   goals,
		savings: savings,
		update:  update,
		broker:  broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Listed, error) {
	var (
		timestamp = time.Now().UTC()

		savings int64
		res     responses.Listed
	)

	// Locking to prevent weird behavior
	lock.GlobalLock().Lock()

	record, err := c.goals.Find(ctx, c.req.ID)
	if err != nil {
		lock.GlobalLock().Unlock() // deferred does not help here. This is probably a design flaw.
		return res, err
	}

	previous, err := c.goals.Where(ctx, filters.SavingsGoals{
		Currencies: filters.FilterSavingsGoalCurrency([]currency.Type{record.Settings.Currency}),
	})
	if err != nil {
		lock.GlobalLock().Unlock() // deferred does not help here. This is probably a design flaw.
		return res, err
	}

	goals := make([]savings_goal.Record, 0, len(previous))

	// reordering array
	for position := range previous {
		if c.req.From == position {
			continue
		}

		if c.req.To == position {
			goals = append(goals, record)
		}

		goals = append(goals, previous[position])
	}

	s, err := c.savings.Where(ctx, filters.Savings{Currencies: []currency.Type{record.Settings.Currency}})
	if err != nil {
		lock.GlobalLock().Unlock() // deferred does not help here. This is probably a design flaw.
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
		lock.GlobalLock().Unlock() // deferred does not help here. This is probably a design flaw.
		return res, err
	}

	// needs to unlock the system before publishing the message for the background processes to regain a lock.
	// This is probably a design flaw.
	lock.GlobalLock().Unlock()

	err = c.broker.Publish(messages.Reordered{Currency: record.Settings.Currency})
	if err != nil {
		return res, err
	}

	slices.SortFunc(updated, func(a savings_goal.Record, b savings_goal.Record) int {
		return cmp.Compare(a.Settings.Position, b.Settings.Position)
	})

	res = responses.SavingsGoalRecordsToListed(record.Settings.Currency, updated)

	return res, nil
}

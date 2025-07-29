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
	"financo/core/scope_savings_goals/infrastructure/lock"
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

	// Locking to prevent weird behavior
	lock.GlobalLock().Lock()

	record, err := c.goal.Find(ctx, c.req.ID)
	if err != nil {
		lock.GlobalLock().Unlock() // deferred does not help here. This is probably a design flaw.
		return res, err
	}

	record = c.req.UpdateRecord(record, timestamp)

	if record.Settings.Saved < record.Settings.Target {
		lock.GlobalLock().Unlock() // deferred does not help here. This is probably a design flaw.
		return res, errors.ErrGoalHasNotBeenAchieved
	}

	err = c.update.Save(ctx, record)
	if err != nil {
		lock.GlobalLock().Unlock() // deferred does not help here. This is probably a design flaw.
		return res, err
	}

	// needs to unlock the system before publishing the message for the background processes to regain a lock.
	// This is probably a design flaw.
	lock.GlobalLock().Unlock()

	err = c.broker.Publish(messages.MarkedAsAchieved{Record: record})
	if err != nil {
		return res, err
	}

	res = responses.NewMarkedAsAchieved(record)

	return res, nil
}

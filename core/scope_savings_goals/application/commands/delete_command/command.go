package delete_command

import (
	"context"
	"financo/core/domain/commands"
	"financo/core/scope_savings_goals/domain/brokers"
	"financo/core/scope_savings_goals/domain/messages"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/core/scope_savings_goals/domain/requests"
	"financo/core/scope_savings_goals/domain/responses"
	"financo/core/scope_savings_goals/infrastructure/lock"
	"time"
)

type command struct {
	req    requests.Delete
	goal   repositories.SavingsGoal
	delete repositories.UpdateRepository
	broker brokers.Deleted
}

func New(
	req requests.Delete,
	goal repositories.SavingsGoal,
	delete repositories.UpdateRepository,
	broker brokers.Deleted,
) commands.Command[responses.Detailed] {
	return &command{
		req:    req,
		goal:   goal,
		delete: delete,
		broker: broker,
	}
}

func (c *command) Run(ctx context.Context) (responses.Detailed, error) {
	var (
		timestamp = time.Now().UTC()

		res responses.Detailed
	)

	// Locking to prevent weird behavior
	lock.GlobalLock().Lock()

	record, err := c.goal.Find(ctx, c.req.ID)
	if err != nil {
		lock.GlobalLock().Unlock() // deferred does not help here. This is probably a design flaw.
		return res, err
	}

	record = c.req.UpdateRecord(record, timestamp)

	err = c.delete.Save(ctx, record)
	if err != nil {
		lock.GlobalLock().Unlock() // deferred does not help here. This is probably a design flaw.
		return res, err
	}

	// needs to unlock the system before publishing the message for the background processes to regain a lock.
	// This is probably a design flaw.
	lock.GlobalLock().Unlock()

	err = c.broker.Publish(messages.Deleted{Record: record})
	if err != nil {
		return res, err
	}

	res = responses.SavingsGoalRecordToDetailed(record)

	return res, nil
}

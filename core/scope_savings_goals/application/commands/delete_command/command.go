package delete_command

import (
	"cmp"
	"context"
	"financo/core/domain/commands"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/core/scope_savings_goals/domain/requests"
	"financo/core/scope_savings_goals/domain/responses"
	"financo/models/achievement/savings_goal"
	"slices"
	"time"
)

type command struct {
	req         requests.Delete
	goalRepo    repositories.DeleteSavingsGoal
	goalsRepo   repositories.ActiveSavingsGoalsForCurrency
	savingsRepo repositories.SavingsForCurrency
	reorderRepo repositories.Reorder
}

func New(
	req requests.Delete,
	goalRepo repositories.DeleteSavingsGoal,
	goalsRepo repositories.ActiveSavingsGoalsForCurrency,
	savingsRepo repositories.SavingsForCurrency,
	reorderRepo repositories.Reorder,
) commands.Command[responses.Deleted] {
	return &command{
		req:         req,
		goalRepo:    goalRepo,
		goalsRepo:   goalsRepo,
		savingsRepo: savingsRepo,
		reorderRepo: reorderRepo,
	}
}

func (c *command) Run(ctx context.Context) (responses.Deleted, error) {
	var (
		timestamp = time.Now().UTC()

		res responses.Deleted
	)

	record, err := c.goalRepo.Find(ctx, c.req.ID)
	if err != nil {
		return res, err
	}

	record = c.req.UpdateRecord(record, timestamp)

	err = c.goalRepo.SoftDelete(ctx, record)
	if err != nil {
		return res, err
	}

	err = c.updateSavingsGoalsSaved(ctx, record)
	if err != nil {
		return res, err
	}

	res = responses.RecordToDeleted(record)

	return res, nil
}

func (c *command) updateSavingsGoalsSaved(ctx context.Context, record savings_goal.Record) error {
	goals, err := c.goalsRepo.Find(ctx, record.Settings.Currency)
	if err != nil {
		return err
	}

	savings, err := c.savingsRepo.Find(ctx, record.Settings.Currency)
	if err != nil {
		return err
	}

	slices.SortFunc(goals, func(a, b savings_goal.Record) int {
		return cmp.Compare(a.Settings.Position, b.Settings.Position)
	})

	for i := 0; i < len(goals); i++ {
		goals[i].UpdatedAt = record.UpdatedAt
		goals[i].Settings.Position = int16(i) + 1

		if savings.Savings < goals[i].Settings.Target && savings.Savings > 0 {
			goals[i].Settings.Saved = savings.Savings
			savings.Savings = 0
			continue
		}

		if savings.Savings <= 0 {
			goals[i].Settings.Saved = 0
			continue
		}

		goals[i].Settings.Saved = goals[i].Settings.Target
		savings.Savings -= goals[i].Settings.Target
	}

	err = c.reorderRepo.Save(ctx, goals)
	if err != nil {
		return err
	}

	return nil
}

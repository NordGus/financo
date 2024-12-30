package mark_as_achieved_command

import (
	"cmp"
	"context"
	"financo/core/domain/commands"
	"financo/core/scope_savings_goals/domain/errors"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/core/scope_savings_goals/domain/requests"
	"financo/core/scope_savings_goals/domain/responses"
	"financo/models/achievement/savings_goal"
	"slices"
	"time"
)

type command struct {
	req         requests.MarkAsAchieved
	repo        repositories.MarkAsAchieved
	goalsRepo   repositories.ActiveSavingsGoalsForCurrency
	savingsRepo repositories.SavingsForCurrency
	reorderRepo repositories.ReorderRepository
}

func New(
	req requests.MarkAsAchieved,
	repo repositories.MarkAsAchieved,
	goalsRepo repositories.ActiveSavingsGoalsForCurrency,
	savingsRepo repositories.SavingsForCurrency,
	reorderRepo repositories.ReorderRepository,
) commands.Command[responses.MarkedAsAchieved] {
	return &command{
		req:         req,
		repo:        repo,
		goalsRepo:   goalsRepo,
		savingsRepo: savingsRepo,
		reorderRepo: reorderRepo,
	}
}

func (c *command) Run(ctx context.Context) (responses.MarkedAsAchieved, error) {
	var (
		timestamp = time.Now().UTC()

		res responses.MarkedAsAchieved
	)

	record, err := c.repo.Find(ctx, c.req.ID)
	if err != nil {
		return res, err
	}

	record = c.req.UpdateRecord(record, timestamp)

	if record.Settings.Saved < record.Settings.Target {
		return res, errors.ErrGoalHasNotBeenAchieved
	}

	err = c.repo.Save(ctx, record)
	if err != nil {
		return res, err
	}

	err = c.updateSavingsGoalsSaved(ctx, record)
	if err != nil {
		return res, err
	}

	res = responses.RecordToMarkedAsAchieved(record)

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

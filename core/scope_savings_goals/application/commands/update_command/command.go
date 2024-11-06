package update_command

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
	req         requests.Update
	goalRepo    repositories.SavingsGoal
	goalsRepo   repositories.ActiveSavingsGoalsForCurrency
	savingsRepo repositories.SavingsForCurrency
	reorderRepo repositories.Reorder
}

func New(
	req requests.Update,
	goalRepo repositories.SavingsGoal,
	goalsRepo repositories.ActiveSavingsGoalsForCurrency,
	savingsRepo repositories.SavingsForCurrency,
	reorderRepo repositories.Reorder,
) commands.Command[responses.Updated] {
	return &command{
		req:         req,
		goalRepo:    goalRepo,
		goalsRepo:   goalsRepo,
		savingsRepo: savingsRepo,
		reorderRepo: reorderRepo,
	}
}

func (c *command) Run(ctx context.Context) (responses.Updated, error) {
	var (
		timestamp = time.Now().UTC()

		res responses.Updated
	)

	prev, err := c.goalRepo.Find(ctx, c.req.ID)
	if err != nil {
		return res, err
	}

	current := c.req.UpdateRecord(prev, timestamp)

	err = c.goalRepo.Save(ctx, current)
	if err != nil {
		return res, err
	}

	err = c.updateSavingsGoalsSaved(ctx, prev)
	if err != nil {
		return res, err
	}

	if current.Settings.Currency != prev.Settings.Currency {
		err = c.updateSavingsGoalsSaved(ctx, current)
		if err != nil {
			return res, err
		}
	}

	res = responses.RecordToUpdated(current)

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

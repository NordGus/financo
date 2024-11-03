package create_command

import (
	"context"
	"financo/core/domain/commands"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/core/scope_savings_goals/domain/requests"
	"financo/core/scope_savings_goals/domain/responses"
	"time"
)

type command struct {
	req         requests.Create
	savingsRepo repositories.SavingsForCurrency
	goalsRepo   repositories.ActiveSavingsGoalsForCurrency
	repo        repositories.Create
}

func New(
	req requests.Create,
	savingsRepo repositories.SavingsForCurrency,
	goalsRepo repositories.ActiveSavingsGoalsForCurrency,
	repo repositories.Create,
) commands.Command[responses.Created] {
	return &command{
		req:         req,
		savingsRepo: savingsRepo,
		goalsRepo:   goalsRepo,
		repo:        repo,
	}
}

func (c *command) Run(ctx context.Context) (responses.Created, error) {
	var (
		timestamp = time.Now().UTC()
		record    = c.req.ToRecord(timestamp)

		res responses.Created
	)

	savings, err := c.savingsRepo.Find(ctx, record.Settings.Currency)
	if err != nil {
		return res, err
	}

	goals, err := c.goalsRepo.Find(ctx, record.Settings.Currency)
	if err != nil {
		return res, err
	}

	record.Settings.Position = int16(len(goals)) + 1

	goals = append(goals, record)

	for i := 0; i < len(goals); i++ {
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

	record, err = c.repo.Save(ctx, goals[len(goals)-1])
	if err != nil {
		return res, err
	}

	res = responses.RecordToCreated(record)

	return res, nil
}

package reorder_command

import (
	"context"
	"financo/core/domain/commands"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/core/scope_savings_goals/domain/requests"
	"financo/core/scope_savings_goals/domain/responses"
	"time"
)

type command struct {
	req         requests.Reorder
	savingsRepo repositories.SavingsForCurrency
	repo        repositories.Reorder
}

func New(
	req requests.Reorder,
	savingsRepo repositories.SavingsForCurrency,
	repo repositories.Reorder,
) commands.Command[responses.Reorder] {
	return &command{
		req:         req,
		savingsRepo: savingsRepo,
		repo:        repo,
	}
}

func (c *command) Run(ctx context.Context) (responses.Reorder, error) {
	var (
		timestamp = time.Now().UTC()
		res       = responses.Reorder{
			Currency: c.req.Currency,
			Goals:    c.req.Goals,
		}

		savings int64
	)

	s, err := c.savingsRepo.Find(ctx, res.Currency)
	if err != nil {
		return res, err
	}

	savings = s.Savings

	for i := 0; i < len(res.Goals); i++ {
		res.Goals[i].UpdatedAt = timestamp

		if savings < res.Goals[i].Settings.Target && savings > 0 {
			res.Goals[i].Settings.Saved = savings
			savings = 0
			continue
		}

		if savings <= 0 {
			res.Goals[i].Settings.Saved = 0
			continue
		}

		res.Goals[i].Settings.Saved = savings - res.Goals[i].Settings.Target
		savings -= res.Goals[i].Settings.Target
	}

	err = c.repo.Save(ctx, res.Goals)
	if err != nil {
		return res, err
	}

	return res, nil
}

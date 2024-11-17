package on_transaction_created

import (
	"cmp"
	"context"
	"financo/core/domain/event_handlers"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/core/scope_transactions/domain/messages"
	"financo/models/account"
	"financo/models/achievement/savings_goal"
	"slices"
	"time"
)

type handler struct {
	repo repositories.OnTransactionCreated
}

func New(repo repositories.OnTransactionCreated) event_handlers.EventHandler[messages.Created] {
	return &handler{
		repo: repo,
	}
}

func (h *handler) Handle(message messages.Created) error {
	var (
		ctx       = context.TODO()
		timestamp = time.Now().UTC()
		goals     = make([]savings_goal.Record, 0, 30)
	)

	accounts, err := h.repo.FindAccounts(ctx, message.Record)
	if err != nil {
		return err
	}

	if !account.IsSavings(accounts.Source.Kind) && !account.IsSavings(accounts.Target.Kind) {
		// returns immediately to prevent using more resources if the
		// transaction doesn't contains a Savings account
		return nil
	}

	if account.IsSavings(accounts.Source.Kind) {
		sourceGoals, err := h.findAndUpdateGoalsFor(ctx, accounts.Source, timestamp)
		if err != nil {
			return err
		}

		goals = append(goals, sourceGoals...)
	}

	if account.IsSavings(accounts.Target.Kind) {
		targetGoals, err := h.findAndUpdateGoalsFor(ctx, accounts.Target, timestamp)
		if err != nil {
			return err
		}

		goals = append(goals, targetGoals...)
	}

	err = h.repo.Save(ctx, goals)
	if err != nil {
		return err
	}

	return nil
}

func (h *handler) findAndUpdateGoalsFor(
	ctx context.Context, acc account.Record, timestamp time.Time,
) ([]savings_goal.Record, error) {
	var goals []savings_goal.Record

	data, err := h.repo.FindGoalsForCurrency(ctx, acc.Currency)
	if err != nil {
		return goals, err
	}

	slices.SortFunc(data.Goals, func(a, b savings_goal.Record) int {
		return cmp.Compare(a.Settings.Position, b.Settings.Position)
	})

	for i := 0; i < len(data.Goals); i++ {
		data.Goals[i].UpdatedAt = timestamp

		if data.Savings < data.Goals[i].Settings.Target && data.Savings > 0 {
			data.Goals[i].Settings.Saved = data.Savings
			data.Savings = 0
			continue
		}

		if data.Savings <= 0 {
			data.Goals[i].Settings.Saved = 0
			continue
		}

		data.Goals[i].Settings.Saved = data.Goals[i].Settings.Target
		data.Savings -= data.Goals[i].Settings.Target
	}

	goals = data.Goals

	return goals, nil
}

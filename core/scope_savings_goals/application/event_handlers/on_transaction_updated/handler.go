package on_transaction_updated

import (
	"cmp"
	"context"
	"financo/core/domain/event_handlers"
	"financo/core/scope_savings_goals/domain/models"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/core/scope_transactions/domain/messages"
	"financo/models/account"
	"financo/models/achievement/savings_goal"
	"slices"
	"time"
)

type handler struct {
	repo repositories.OnTransactionOperated
}

func New(repo repositories.OnTransactionOperated) event_handlers.EventHandler[messages.Updated] {
	return &handler{
		repo: repo,
	}
}

func (h *handler) Handle(message messages.Updated) error {
	var (
		ctx       = context.TODO()
		timestamp = time.Now().UTC()
		goals     = make([]savings_goal.Record, 0, 30)
	)

	current, err := h.repo.FindAccounts(ctx, message.Current)
	if err != nil {
		return err
	}

	previous, err := h.repo.FindAccounts(ctx, message.Previous)
	if err != nil {
		return err
	}

	if h.skip(current, previous) {
		// returns immediately to prevent using more resources if the
		// transaction doesn't contains a Savings account
		return nil
	}

	if account.IsSavings(current.Source.Kind) {
		updated, err := h.findAndUpdateGoalsFor(ctx, current.Source, timestamp)
		if err != nil {
			return err
		}

		goals = append(goals, updated...)
	}

	if account.IsSavings(current.Target.Kind) {
		updated, err := h.findAndUpdateGoalsFor(ctx, current.Target, timestamp)
		if err != nil {
			return err
		}

		goals = append(goals, updated...)
	}

	if account.IsSavings(previous.Source.Kind) {
		updated, err := h.findAndUpdateGoalsFor(ctx, previous.Source, timestamp)
		if err != nil {
			return err
		}

		goals = append(goals, updated...)
	}

	if account.IsSavings(previous.Target.Kind) {
		updated, err := h.findAndUpdateGoalsFor(ctx, previous.Target, timestamp)
		if err != nil {
			return err
		}

		goals = append(goals, updated...)
	}

	err = h.repo.Save(ctx, goals)
	if err != nil {
		return err
	}

	return nil
}

func (h *handler) skip(current models.AccountsForTransaction, prev models.AccountsForTransaction) bool {
	return !account.IsSavings(current.Source.Kind) &&
		!account.IsSavings(current.Target.Kind) &&
		!account.IsSavings(prev.Source.Kind) &&
		!account.IsSavings(prev.Target.Kind)
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

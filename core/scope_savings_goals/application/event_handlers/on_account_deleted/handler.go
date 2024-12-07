package on_account_deleted

import (
	"cmp"
	"context"
	"financo/core/domain/event_handlers"
	"financo/core/scope_accounts/domain/messages"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/models/account"
	"financo/models/achievement/savings_goal"
	"slices"
	"time"
)

type handler struct {
	repo repositories.OnAccountOperated
}

func New(repo repositories.OnAccountOperated) event_handlers.EventHandler[messages.Deleted] {
	return &handler{
		repo: repo,
	}
}

func (h *handler) Handle(event messages.Deleted) error {
	var (
		ctx       = context.Background()
		timestamp = time.Now().UTC()
	)

	if !account.IsSavings(event.Record.Kind) {
		return nil // Only process savings account
	}

	data, err := h.repo.Find(ctx, event.Record.Currency)
	if err != nil {
		return err
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

	err = h.repo.Save(ctx, data.Goals)
	if err != nil {
		return err
	}

	return nil
}

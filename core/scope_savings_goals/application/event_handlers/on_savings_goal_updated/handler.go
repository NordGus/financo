package on_savings_goal_updated

import (
	"context"
	"financo/core/domain/event_handlers"
	"financo/core/scope_savings_goals/domain/filters"
	"financo/core/scope_savings_goals/domain/messages"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/lib/currency"
	"financo/models/achievement/savings_goal"
	"time"
)

type savingsFor map[currency.Type]int64

type handler struct {
	goals   repositories.SavingsGoalsRepository
	savings repositories.SavingsRepository
	update  repositories.UpdateRepository
}

func New(
	goals repositories.SavingsGoalsRepository,
	savings repositories.SavingsRepository,
	update repositories.UpdateRepository,
) event_handlers.EventHandler[messages.Updated] {
	return &handler{
		goals:   goals,
		savings: savings,
		update:  update,
	}
}

func (h *handler) Handle(message messages.Updated) error {
	var (
		ctx       = context.Background()
		timestamp = time.Now().UTC()

		sf = filters.Savings{
			Currencies: []currency.Type{
				message.Current.Settings.Currency,
				message.Previous.Settings.Currency,
			},
		}
	)

	s, err := h.savings.Where(ctx, sf)
	if err != nil {
		return err
	}

	err = h.updateGoalsFor(ctx, s, message.Current, timestamp)
	if err != nil {
		return err
	}

	if message.Previous.Settings.Currency == message.Current.Settings.Currency {
		return nil
	}

	err = h.updateGoalsFor(ctx, s, message.Previous, timestamp)
	if err != nil {
		return err
	}

	return nil
}

func (h *handler) updateGoalsFor(ctx context.Context, s savingsFor, r savings_goal.Record, ts time.Time) error {
	var (
		savings = s[r.Settings.Currency]
		gf      = filters.SavingsGoals{
			Currencies: []currency.Type{r.Settings.Currency},
		}
	)

	goals, err := h.goals.Where(ctx, gf)
	if err != nil {
		return err
	}

	for i := 0; i < len(goals); i++ {
		goals[i].UpdatedAt = ts
		goals[i].Settings.Position = int16(i) + 1

		if savings < goals[i].Settings.Target && savings > 0 {
			goals[i].Settings.Saved = savings
			savings = 0
			continue
		}

		if savings <= 0 {
			goals[i].Settings.Saved = 0
			continue
		}

		goals[i].Settings.Saved = goals[i].Settings.Target
		savings -= goals[i].Settings.Target
	}

	err = h.update.SaveMultiple(ctx, goals)
	if err != nil {
		return err
	}

	return nil
}

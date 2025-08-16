package on_savings_goal_created

import (
	"context"
	"financo/core/domain/event_handlers"
	"financo/core/scope_savings_goals/domain/filters"
	"financo/core/scope_savings_goals/domain/messages"
	"financo/core/scope_savings_goals/domain/repositories"
	"financo/lib/currency"
	"time"
)

type handler struct {
	goals   repositories.SavingsGoalsRepository
	savings repositories.SavingsRepository
	update  repositories.UpdateRepository
}

func New(
	goals repositories.SavingsGoalsRepository,
	savings repositories.SavingsRepository,
	update repositories.UpdateRepository,
) event_handlers.EventHandler[messages.Created] {
	return &handler{
		goals:   goals,
		savings: savings,
		update:  update,
	}
}

func (h *handler) Handle(message messages.Created) error {
	var (
		ctx        = context.Background()
		timestamp  = time.Now().UTC()
		currencies = []currency.Type{message.Record.Settings.Currency}

		gf = filters.SavingsGoals{Currencies: currencies}
		sf = filters.Savings{Currencies: currencies}
	)

	goals, err := h.goals.Where(ctx, gf)
	if err != nil {
		return err
	}

	s, err := h.savings.Where(ctx, sf)
	if err != nil {
		return err
	}

	savings := s[message.Record.Settings.Currency]

	for i := 0; i < len(goals); i++ {
		goals[i].UpdatedAt = timestamp
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

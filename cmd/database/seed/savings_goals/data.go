package savings_goals

import (
	"financo/cmd/database/seed/lib/helpers"
	"financo/core/scope_savings_goals/domain/requests"
	"financo/lib/currency"
	"financo/lib/nullable"
	"time"
)

var (
	create = []requests.Create{
		{
			Name:        "To the baby steps",
			Description: nullable.New("A journey of a thousand kilometers start with a single step."),
			Currency:    currency.EUR,
			Target:      100_00,
		},
		{
			Name:        "To the baby steps",
			Description: nullable.New("A journey of a thousand miles start with a single step."),
			Currency:    currency.USD,
			Target:      100_00,
		},
		{
			Name:        "My first emergency fund",
			Description: nullable.New("Now an unexpected expense can't derail you."),
			Currency:    currency.EUR,
			Target:      1_000_00,
		},
		{
			Name:        "This is not even my final form",
			Description: nullable.New("Take the emergency fund to cover 3 months of expenses."),
			Currency:    currency.EUR,
			Target:      6_000_00,
		},
		{
			Name:        "Inner Peace",
			Description: nullable.New("Your emergency fund gives you 6 months of runway."),
			Currency:    currency.EUR,
			Target:      12_000_00,
		},
		{
			Name:        "Harmony within, Hurricane without",
			Description: nullable.New("Now your emergency fund covers for a year's worth of expenses."),
			Currency:    currency.EUR,
			Target:      24_000_00,
		},
		{
			Name:        "Upgrades for my Desktop",
			Description: nullable.Type[string]{},
			Currency:    currency.EUR,
			Target:      1_000_00,
		},
		{
			Name:        "Investment for the Studio",
			Description: nullable.New("Buying some hardware to create games better."),
			Currency:    currency.EUR,
			Target:      6_000_00,
		},
		{
			Name:        "Honeymoon",
			Description: nullable.New("A little treat for my spouse."),
			Currency:    currency.EUR,
			Target:      20_000_00,
		},
		{
			Name:        "USD First Emergency Fund",
			Description: nullable.New("An emergency fund for the family outside of Europe."),
			Currency:    currency.USD,
			Target:      1_000_00,
		},
	}

	achieved = map[string]time.Time{
		helpers.SavingsGoalMapKey(create[0].Name, create[0].Currency): time.Now().AddDate(0, -12, 0).UTC(),
		helpers.SavingsGoalMapKey(create[1].Name, create[1].Currency): time.Now().AddDate(0, 0, -15).UTC(),
	}
)

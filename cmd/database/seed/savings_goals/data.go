package savings_goals

import (
	"financo/server/types/generic/nullable"
	"financo/server/types/records/achievement"
	"financo/server/types/records/achievement/savings_goal"
	"financo/server/types/shared/currency"
	"time"
)

type goalSeed struct {
	Record savings_goal.Record

	AchievedAt func(moment time.Time) nullable.Type[time.Time]
	DeletedAt  func(moment time.Time) nullable.Type[time.Time]
}

var (
	achievements = []goalSeed{
		{
			Record: savings_goal.Record{
				Kind:        achievement.SavingsGoal,
				Name:        "To the baby steps",
				Description: nullable.New("A journey of a thousand kilometers start with a single step."),
				Settings: savings_goal.Settings{
					Position: 1,
					Target:   100_00,
					Saved:    100_00,
					Currency: currency.EUR,
				},
			},
			AchievedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.New(moment.AddDate(0, -1, -15).UTC())
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
		{
			Record: savings_goal.Record{
				Kind:        achievement.SavingsGoal,
				Name:        "USD To the baby steps",
				Description: nullable.New("A journey of a thousand kilometers start with a single step."),
				Settings: savings_goal.Settings{
					Position: 1,
					Target:   100_00,
					Saved:    100_00,
					Currency: currency.USD,
				},
			},
			AchievedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.New(moment.AddDate(0, 0, -15).UTC())
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
		{
			Record: savings_goal.Record{
				Kind:        achievement.SavingsGoal,
				Name:        "My first emergency fund",
				Description: nullable.New("Now an unexpected expense can't derail you."),
				Settings: savings_goal.Settings{
					Position: 1,
					Target:   1_000_00,
					Saved:    1_000_00,
					Currency: currency.EUR,
				},
			},
			AchievedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
		{
			Record: savings_goal.Record{
				Kind:        achievement.SavingsGoal,
				Name:        "This is not even my final form",
				Description: nullable.New("Take the emergency fund to cover 3 months of expenses."),
				Settings: savings_goal.Settings{
					Position: 1,
					Target:   6_000_00,
					Saved:    0,
					Currency: currency.EUR,
				},
			},
			AchievedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
		{
			Record: savings_goal.Record{
				Kind:        achievement.SavingsGoal,
				Name:        "Inner Peace",
				Description: nullable.New("Your emergency fund gives you 6 months of runway."),
				Settings: savings_goal.Settings{
					Position: 2,
					Target:   12_000_00,
					Saved:    0,
					Currency: currency.EUR,
				},
			},
			AchievedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
		{
			Record: savings_goal.Record{
				Kind:        achievement.SavingsGoal,
				Name:        "Harmony within, Hurricane without",
				Description: nullable.New("Now your emergency fund covers for a year's worth of expenses."),
				Settings: savings_goal.Settings{
					Position: 3,
					Target:   24_000_00,
					Saved:    0,
					Currency: currency.EUR,
				},
			},
			AchievedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
		{
			Record: savings_goal.Record{
				Kind:        achievement.SavingsGoal,
				Name:        "Upgrades for my Desktop",
				Description: nullable.Type[string]{},
				Settings: savings_goal.Settings{
					Position: 4,
					Target:   1_000_00,
					Saved:    0,
					Currency: currency.EUR,
				},
			},
			AchievedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
		{
			Record: savings_goal.Record{
				Kind:        achievement.SavingsGoal,
				Name:        "Investment for the Studio",
				Description: nullable.New("Buying some hardware to create games better."),
				Settings: savings_goal.Settings{
					Position: 5,
					Target:   6_000_00,
					Saved:    0,
					Currency: currency.EUR,
				},
			},
			AchievedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
		{
			Record: savings_goal.Record{
				Kind:        achievement.SavingsGoal,
				Name:        "Honeymoon",
				Description: nullable.New("A little treat for my spouse."),
				Settings: savings_goal.Settings{
					Position: 6,
					Target:   20_000_00,
					Saved:    0,
					Currency: currency.EUR,
				},
			},
			AchievedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
		{
			Record: savings_goal.Record{
				Kind:        achievement.SavingsGoal,
				Name:        "To the forest!",
				Description: nullable.New("For that mountain cabin."),
				Settings: savings_goal.Settings{
					Position: 6,
					Target:   100_000_00,
					Saved:    0,
					Currency: currency.EUR,
				},
			},
			AchievedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
		{
			Record: savings_goal.Record{
				Kind:        achievement.SavingsGoal,
				Name:        "USD First Emergency Fund",
				Description: nullable.New("An emergency fund for the family outside of Europe."),
				Settings: savings_goal.Settings{
					Position: 1,
					Target:   1_000_00,
					Saved:    0,
					Currency: currency.USD,
				},
			},
			AchievedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
		},
	}
)

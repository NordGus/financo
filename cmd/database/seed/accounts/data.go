package accounts

import (
	"financo/server/types/generic/nullable"
	"financo/server/types/records/account"
	"financo/server/types/records/transaction"
	"financo/server/types/shared/currency"
	"financo/server/types/shared/icon"
	"time"
)

type accountSeed struct {
	Account  account.Record
	Children []childAccountSeed

	ArchivedAt func(moment time.Time) nullable.Type[time.Time]
	DeletedAt  func(moment time.Time) nullable.Type[time.Time]

	HistoryAt      func(moment time.Time) nullable.Type[time.Time]
	HistoryCapital int64

	MapKey string
}

type childAccountSeed struct {
	Account account.Record

	ArchivedAt func(moment time.Time) nullable.Type[time.Time]
	DeletedAt  func(moment time.Time) nullable.Type[time.Time]

	MapKey string
}

var (
	accounts = []accountSeed{
		{
			Account: account.Record{
				Kind:        account.CapitalNormal,
				Currency:    currency.EUR,
				Name:        "My Personal Bank Account",
				Description: nullable.New("The account where I get my paycheck"),
				Color:       "#eb8934",
				Icon:        icon.Base,
				Capital:     0,
			},
			Children: []childAccountSeed{},

			ArchivedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},

			HistoryAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.New(moment.AddDate(0, -1, 0))
			},
			HistoryCapital: 1_337_42,

			MapKey: "personal_bank_account",
		},
		{
			Account: account.Record{
				Kind:        account.CapitalNormal,
				Currency:    currency.EUR,
				Name:        "Freelance bank account",
				Description: nullable.New("Where I get paid for my freelance job"),
				Color:       "#34baeb",
				Icon:        icon.Base,
				Capital:     0,
			},
			Children: []childAccountSeed{},

			ArchivedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.New(moment.AddDate(0, 0, -90))
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},

			HistoryAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			HistoryCapital: 0,

			MapKey: "freelance_bank_account",
		},
		{
			Account: account.Record{
				Kind:        account.CapitalSavings,
				Currency:    currency.EUR,
				Name:        "My Savings Account",
				Description: nullable.New("The account where I store my savings"),
				Color:       "#eb8934",
				Icon:        icon.Base,
				Capital:     0,
			},
			Children: []childAccountSeed{},

			ArchivedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},

			HistoryAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.New(moment.AddDate(0, -6, 0))
			},
			HistoryCapital: 42,

			MapKey: "personal_savings_account",
		},
		{
			Account: account.Record{
				Kind:        account.CapitalSavings,
				Currency:    currency.USD,
				Name:        "My US Savings Account",
				Description: nullable.Type[string]{},
				Color:       "#34baeb",
				Icon:        icon.Base,
				Capital:     0,
			},
			Children: []childAccountSeed{},

			ArchivedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},

			HistoryAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			HistoryCapital: 0,

			MapKey: "us_savings_account",
		},
		{
			Account: account.Record{
				Kind:        account.CapitalSavings,
				Currency:    currency.EUR,
				Name:        "My German Savings Account",
				Description: nullable.Type[string]{},
				Color:       "#34baeb",
				Icon:        icon.Base,
				Capital:     0,
			},
			Children: []childAccountSeed{},

			ArchivedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.New(moment)
			},

			HistoryAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			HistoryCapital: 0,

			MapKey: "german_savings_account",
		},
		{
			Account: account.Record{
				Kind:        account.DebtLoan,
				Currency:    currency.EUR,
				Name:        "Car loan",
				Description: nullable.New("My japanese shit-box"),
				Color:       "#eb8934",
				Icon:        icon.Base,
				Capital:     5_000_00,
			},
			Children: []childAccountSeed{},

			ArchivedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},

			HistoryAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.New(moment.AddDate(-1, 0, 0))
			},
			HistoryCapital: -3_000_00,

			MapKey: "car_loan",
		},
		{
			Account: account.Record{
				Kind:        account.DebtPersonal,
				Currency:    currency.EUR,
				Name:        "Morgan's Loan",
				Description: nullable.New("I helped Morgan with their rent"),
				Color:       "#34baeb",
				Icon:        icon.Base,
				Capital:     -500_00,
			},
			Children: []childAccountSeed{},

			ArchivedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},

			HistoryAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.New(moment.AddDate(0, -1, 0))
			},
			HistoryCapital: 300_00,

			MapKey: "morgan_loan",
		},
		{
			Account: account.Record{
				Kind:        account.DebtPersonal,
				Currency:    currency.EUR,
				Name:        "Carlos' Lunch",
				Description: nullable.New("Carlos' catch up lunch"),
				Color:       "#34baeb",
				Icon:        icon.Base,
				Capital:     -80_00,
			},
			Children: []childAccountSeed{},

			ArchivedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.New(moment)
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},

			HistoryAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.New(moment.AddDate(0, 0, -1))
			},
			HistoryCapital: 80_00,

			MapKey: "carlos_lunch",
		},
		{
			Account: account.Record{
				Kind:        account.DebtCredit,
				Currency:    currency.EUR,
				Name:        "Credit Card",
				Description: nullable.New("My bank's credit card"),
				Color:       "#eb8934",
				Icon:        icon.Base,
				Capital:     2_000_00,
			},
			Children: []childAccountSeed{},

			ArchivedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},

			HistoryAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.New(moment.AddDate(0, -3, 0))
			},
			HistoryCapital: -800_00,

			MapKey: "credit_card",
		},
		{
			Account: account.Record{
				Kind:        account.DebtCredit,
				Currency:    currency.EUR,
				Name:        "Laptop financing Credit Line",
				Description: nullable.Type[string]{},
				Color:       "#34baeb",
				Icon:        icon.Base,
				Capital:     2_500_00,
			},
			Children: []childAccountSeed{},

			ArchivedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.New(moment)
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},

			HistoryAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.New(moment.AddDate(0, -8, 0))
			},
			HistoryCapital: -1_234_69,

			MapKey: "laptop_credit",
		},
		{
			Account: account.Record{
				Kind:        account.ExternalIncome,
				Currency:    currency.EUR,
				Name:        "Paycheck",
				Description: nullable.New("Where the bread comes from"),
				Color:       "#eb8934",
				Icon:        icon.Base,
				Capital:     0,
			},
			Children: []childAccountSeed{
				{
					Account: account.Record{
						// ParentID will be added later after the creation of its corresponding account.
						Kind:        account.ExternalIncome,
						Currency:    currency.EUR,
						Name:        "Freelancing",
						Description: nullable.New("Hustling"),
						Color:       "#eb8934",
						Icon:        icon.Base,
						Capital:     0,
					},

					ArchivedAt: func(moment time.Time) nullable.Type[time.Time] {
						return nullable.New(moment)
					},
					DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
						return nullable.Type[time.Time]{}
					},

					MapKey: "freelancing",
				},
				{
					Account: account.Record{
						// ParentID will be added later after the creation of its corresponding account.
						Kind:        account.ExternalIncome,
						Currency:    currency.EUR,
						Name:        "Day Job",
						Description: nullable.New("Grinding"),
						Color:       "#eb8934",
						Icon:        icon.Base,
						Capital:     0,
					},

					ArchivedAt: func(moment time.Time) nullable.Type[time.Time] {
						return nullable.Type[time.Time]{}
					},
					DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
						return nullable.Type[time.Time]{}
					},

					MapKey: "day_job",
				},
				{
					Account: account.Record{
						// ParentID will be added later after the creation of its corresponding account.
						Kind:        account.ExternalIncome,
						Currency:    currency.EUR,
						Name:        "Teaching",
						Description: nullable.New("Side Hustle"),
						Color:       "#eb8934",
						Icon:        icon.Base,
						Capital:     0,
					},

					ArchivedAt: func(moment time.Time) nullable.Type[time.Time] {
						return nullable.Type[time.Time]{}
					},
					DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
						return nullable.Type[time.Time]{}
					},

					MapKey: "teaching",
				},
			},

			ArchivedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},

			HistoryAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			HistoryCapital: 0,

			MapKey: "paycheck",
		},
		{
			Account: account.Record{
				Kind:        account.ExternalIncome,
				Currency:    currency.EUR,
				Name:        "Allowance",
				Description: nullable.Type[string]{},
				Color:       "#eb8934",
				Icon:        icon.Base,
				Capital:     0,
			},
			Children: []childAccountSeed{},

			ArchivedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.New(moment.AddDate(0, 0, -1))
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},

			HistoryAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			HistoryCapital: 0,

			MapKey: "allowance",
		},
		{
			Account: account.Record{
				Kind:        account.ExternalExpense,
				Currency:    currency.EUR,
				Name:        "Market",
				Description: nullable.New("I need to survive"),
				Color:       "#34ebae",
				Icon:        icon.Base,
			},
			Children: []childAccountSeed{
				{
					Account: account.Record{
						// ParentID will be added later after the creation of its corresponding account.
						Kind:        account.ExternalExpense,
						Currency:    currency.EUR,
						Name:        "Gardening supplies",
						Description: nullable.New("My ADHD demands to be fed dopamine"),
						Color:       "#34ebae",
						Icon:        icon.Base,
						Capital:     0,
					},

					ArchivedAt: func(moment time.Time) nullable.Type[time.Time] {
						return nullable.New(moment)
					},
					DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
						return nullable.Type[time.Time]{}
					},

					MapKey: "gardening_supplies",
				},
				{
					Account: account.Record{
						// ParentID will be added later after the creation of its corresponding account.
						Kind:        account.ExternalExpense,
						Currency:    currency.EUR,
						Name:        "Food",
						Description: nullable.New("Fuel for my body"),
						Color:       "#34ebae",
						Icon:        icon.Base,
						Capital:     0,
					},

					ArchivedAt: func(moment time.Time) nullable.Type[time.Time] {
						return nullable.Type[time.Time]{}
					},
					DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
						return nullable.Type[time.Time]{}
					},

					MapKey: "food",
				},
				{
					Account: account.Record{
						// ParentID will be added later after the creation of its corresponding account.
						Kind:        account.ExternalExpense,
						Currency:    currency.EUR,
						Name:        "Fruit Shop",
						Description: nullable.Type[string]{},
						Color:       "#34ebae",
						Icon:        icon.Base,
						Capital:     0,
					},

					ArchivedAt: func(moment time.Time) nullable.Type[time.Time] {
						return nullable.Type[time.Time]{}
					},
					DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
						return nullable.Type[time.Time]{}
					},

					MapKey: "fruit_shop",
				},
			},

			ArchivedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},

			HistoryAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			HistoryCapital: 0,

			MapKey: "paycheck",
		},
		{
			Account: account.Record{
				Kind:        account.ExternalExpense,
				Currency:    currency.EUR,
				Name:        "Transport",
				Description: nullable.Type[string]{},
				Color:       "#e5eb34",
				Icon:        icon.Base,
			},
			Children: []childAccountSeed{},

			ArchivedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},

			HistoryAt: func(moment time.Time) nullable.Type[time.Time] {
				return nullable.Type[time.Time]{}
			},
			HistoryCapital: 0,

			MapKey: "transport",
		},
	}

	historyTemplate = account.Record{
		// Doesn't need ID because is a new record.
		// ParentID will be added later after the creation of its corresponding account.
		Kind: account.SystemHistoric,
		// Currency will be added at seeding time.
		Name:        "History",
		Description: nullable.New("This is an automatically created account by the system to represent the lost balance history of the parent account. DO NOT MODIFY NOR DELETE"),
		Color:       "#8c8c8c",
		Icon:        icon.Base,
		// Doesn't need Capital because is not a debt record.
		// ArchivedAt will be added at seeding time.
		// Doesn't will be added at seeding time.
		// CreatedAt will be added at seeding time.
		// UpdatedAt will be added at seeding time.
	}

	historyTransactionTemplate = transaction.Record{
		// Doesn't need ID because is a new record.
		// SourceID will be added later after the creation of its corresponding account.
		// TargetID will be added later after the creation of its corresponding account.
		// SourceAmount will be added later after the creation of its corresponding account.
		// TargetAmount will be added later after the creation of its corresponding account.
		Notes: nullable.New("This transaction was created automatically by the system. DO NOT MODIFY"),
		// IssuedAt will be added later after the creation of its corresponding account.
		// ExecutedAt will be added later after the creation of its corresponding account.
		// Doesn't need DeletedAt, because is not deleted.
		// CreatedAt will be added at seeding time.
		// UpdatedAt will be added at seeding time.
	}
)

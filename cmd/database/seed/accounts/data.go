package accounts

import (
	"financo/core/scope_accounts/domain/requests"
	"financo/lib/currency"
	"financo/lib/icon"
	"financo/lib/nullable"
	"financo/models/account"
	"time"
)

type createReq struct {
	req      requests.Create
	key      string
	archived bool
}

var (
	create = []createReq{
		{
			req: requests.Create{
				Kind:        account.CapitalNormal,
				Currency:    currency.EUR,
				Name:        "My Personal Bank Account",
				Description: nullable.New("The account where I get my paycheck"),
				Capital:     0,
				Color:       "#eb8934",
				Icon:        icon.Landmark,
				History: requests.History{
					At:      nullable.New(time.Now().UTC().AddDate(0, -1, 0)),
					Balance: nullable.New[int64](1_337_42),
				},
				Main: true,
			},
			key:      "personal_bank_account",
			archived: false,
		},
		{
			req: requests.Create{
				Kind:        account.CapitalNormal,
				Currency:    currency.EUR,
				Name:        "Freelance bank account",
				Description: nullable.New("Where I get paid for my freelance job"),
				Capital:     0,
				Color:       "#34baeb",
				Icon:        icon.HandCoins,
				History:     requests.History{},
				Main:        false,
			},
			key:      "freelance_bank_account",
			archived: true,
		},
		{
			req: requests.Create{
				Kind:        account.CapitalSavings,
				Currency:    currency.EUR,
				Name:        "My Savings Account",
				Description: nullable.New("The account where I store my savings"),
				Capital:     0,
				Color:       "#eb8934",
				Icon:        icon.PiggyBank,
				History: requests.History{
					At:      nullable.New(time.Now().UTC().AddDate(0, -6, 0)),
					Balance: nullable.New[int64](420_69),
				},
				Main: false,
			},
			key:      "personal_savings_account",
			archived: false,
		},
		{
			req: requests.Create{
				Kind:     account.CapitalSavings,
				Currency: currency.USD,
				Name:     "My US Savings Account",
				Capital:  0,
				Color:    "#eb8934",
				Icon:     icon.PiggyBank,
				History: requests.History{
					At:      nullable.New(time.Now().UTC().AddDate(0, -3, 0)),
					Balance: nullable.New[int64](343_00),
				},
				Main: false,
			},
			key:      "us_savings_account",
			archived: false,
		},
		{
			req: requests.Create{
				Kind:        account.DebtLoan,
				Currency:    currency.EUR,
				Name:        "Car loan",
				Description: nullable.New("My japanese shit-box"),
				Capital:     -5_000_00,
				Color:       "#eb8934",
				Icon:        icon.CarFront,
				History: requests.History{
					At:      nullable.New(time.Now().UTC().AddDate(-1, 0, 0)),
					Balance: nullable.New[int64](3_000_00),
				},
				Main: false,
			},
			key:      "car_loan",
			archived: false,
		},
		{
			req: requests.Create{
				Kind:        account.DebtPersonal,
				Currency:    currency.EUR,
				Name:        "Morgan's Loan",
				Description: nullable.New("I helped Morgan with their rent"),
				Capital:     500_00,
				Color:       "#34baeb",
				Icon:        icon.House,
				History: requests.History{
					At:      nullable.New(time.Now().UTC().AddDate(0, -1, 0)),
					Balance: nullable.New[int64](-300_00),
				},
				Main: false,
			},
			key:      "morgan_loan",
			archived: false,
		},
		{
			req: requests.Create{
				Kind:        account.DebtPersonal,
				Currency:    currency.EUR,
				Name:        "Carlos' Lunch",
				Description: nullable.New("Carlos' catch up lunch"),
				Capital:     80_00,
				Color:       "#34baeb",
				Icon:        icon.HandPlatter,
				History:     requests.History{},
				Main:        false,
			},
			key:      "carlos_lunch",
			archived: true,
		},
		{
			req: requests.Create{
				Kind:        account.DebtCredit,
				Currency:    currency.EUR,
				Name:        "Credit Card",
				Description: nullable.New("My bank's credit card"),
				Capital:     -2_000_00,
				Color:       "#eb8934",
				Icon:        icon.CreditCard,
				History: requests.History{
					At:      nullable.New(time.Now().UTC().AddDate(0, -3, 0)),
					Balance: nullable.New[int64](800_00),
				},
				Main: false,
			},
			key:      "credit_card",
			archived: false,
		},
		{
			req: requests.Create{
				Kind:     account.DebtCredit,
				Currency: currency.EUR,
				Name:     "Laptop financing Credit Line",
				Capital:  -2_500_00,
				Color:    "#34baeb",
				Icon:     icon.Laptop,
				History: requests.History{
					At:      nullable.New(time.Now().UTC().AddDate(0, -8, 0)),
					Balance: nullable.New[int64](1_337_42),
				},
				Main: false,
			},
			key:      "laptop_credit",
			archived: false,
		},
	}
)

package categories

import (
	"financo/core/scope_categories/domain/requests"
	"financo/lib/currency"
	"financo/lib/icon"
	"financo/lib/nullable"
	"financo/models/account"
)

type childCreateReq struct {
	req     requests.CreateChild
	key     string
	archive bool
}

type createReq struct {
	req      requests.Create
	key      string
	archive  bool
	children []childCreateReq
}

var (
	create = []createReq{
		{
			req: requests.Create{
				Kind:        account.ExternalIncome,
				Name:        "Paycheck",
				Description: nullable.New("Where the bread comes from"),
				Currency:    currency.EUR,
				Color:       "#eb8934",
				Icon:        icon.Banknote,
				Children:    make([]requests.CreateChild, 0, 10),
			},
			archive: false,
			key:     "day_job",
			children: []childCreateReq{
				{
					req: requests.CreateChild{
						Name:        "Freelancing",
						Description: nullable.New("Hustling"),
						Icon:        icon.BicepsFlexed,
					},
					archive: true,
					key:     "freelancing",
				},
				{
					req: requests.CreateChild{
						Name:        "Day Job",
						Description: nullable.New("Grinding"),
						Icon:        icon.Briefcase,
					},
					archive: false,
					key:     "day_job",
				},
				{
					req: requests.CreateChild{
						Name:        "Teaching",
						Description: nullable.New("Side Hustle"),
						Icon:        icon.GraduationCap,
					},
					archive: false,
					key:     "teaching",
				},
			},
		},
		{
			req: requests.Create{
				Kind:     account.ExternalIncome,
				Name:     "Allowance",
				Currency: currency.EUR,
				Color:    "#eb8934",
				Icon:     icon.Coins,
				Children: make([]requests.CreateChild, 0, 10),
			},
			archive:  true,
			key:      "allowance",
			children: []childCreateReq{},
		},
		{
			req: requests.Create{
				Kind:        account.ExternalExpense,
				Name:        "Market",
				Description: nullable.New("I need to survive"),
				Currency:    currency.EUR,
				Color:       "#34ebae",
				Icon:        icon.ShoppingBasket,
				Children:    make([]requests.CreateChild, 0, 10),
			},
			archive: false,
			key:     "market",
			children: []childCreateReq{
				{
					req: requests.CreateChild{
						Name:        "Gardening supplies",
						Description: nullable.New("My ADHD demands to be fed dopamine"),
						Icon:        icon.Flower,
					},
					archive: true,
					key:     "gardening_supplies",
				},
				{
					req: requests.CreateChild{
						Name:        "Food",
						Description: nullable.New("Fuel for my body"),
						Icon:        icon.Salad,
					},
					archive: false,
					key:     "food",
				},
				{
					req: requests.CreateChild{
						Name: "Fruit Shop",
						Icon: icon.Salad,
					},
					archive: false,
					key:     "fruit_shop",
				},
			},
		},
		{
			req: requests.Create{
				Kind:     account.ExternalExpense,
				Name:     "Transport",
				Currency: currency.EUR,
				Color:    "#e5eb34",
				Icon:     icon.BusFront,
				Children: make([]requests.CreateChild, 0, 10),
			},
			archive:  false,
			key:      "transport",
			children: []childCreateReq{},
		},
	}
)

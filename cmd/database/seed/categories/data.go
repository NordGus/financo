package categories

import (
	"financo/core/scope_categories/domain/requests"
	"financo/lib/icon"
	"financo/lib/nullable"
	"financo/models/account"
)

type childCreateReq struct {
	req      requests.CreateChild
	key      string
	archived bool
}

type createReq struct {
	req      requests.Create
	key      string
	archived bool
	children []childCreateReq
}

var (
	create = []createReq{
		{
			req: requests.Create{
				Kind:        account.Income,
				Name:        "Paycheck",
				Description: nullable.New("Where the bread comes from"),
				Color:       "#eb8934",
				Icon:        icon.Banknote,
				Children:    make([]requests.CreateChild, 0, 10),
			},
			archived: false,
			key:      "paycheck",
			children: []childCreateReq{
				{
					req: requests.CreateChild{
						Name:        "Freelancing",
						Description: nullable.New("Hustling"),
						Icon:        icon.BicepsFlexed,
					},
					archived: true,
					key:      "freelancing",
				},
				{
					req: requests.CreateChild{
						Name:        "Day Job",
						Description: nullable.New("Grinding"),
						Icon:        icon.Briefcase,
					},
					archived: false,
					key:      "day_job",
				},
				{
					req: requests.CreateChild{
						Name:        "Teaching",
						Description: nullable.New("Side Hustle"),
						Icon:        icon.GraduationCap,
					},
					archived: false,
					key:      "teaching",
				},
			},
		},
		{
			req: requests.Create{
				Kind:     account.Income,
				Name:     "Allowance",
				Color:    "#eb8934",
				Icon:     icon.Coins,
				Children: make([]requests.CreateChild, 0, 10),
			},
			archived: true,
			key:      "allowance",
			children: []childCreateReq{},
		},
		{
			req: requests.Create{
				Kind:        account.Expense,
				Name:        "Market",
				Description: nullable.New("I need to survive"),
				Color:       "#34ebae",
				Icon:        icon.ShoppingBasket,
				Children:    make([]requests.CreateChild, 0, 10),
			},
			archived: false,
			key:      "market",
			children: []childCreateReq{
				{
					req: requests.CreateChild{
						Name:        "Gardening supplies",
						Description: nullable.New("My ADHD demands to be fed dopamine"),
						Icon:        icon.Flower,
					},
					archived: true,
					key:      "gardening_supplies",
				},
				{
					req: requests.CreateChild{
						Name:        "Food",
						Description: nullable.New("Fuel for my body"),
						Icon:        icon.Salad,
					},
					archived: false,
					key:      "food",
				},
				{
					req: requests.CreateChild{
						Name: "Fruit Shop",
						Icon: icon.Salad,
					},
					archived: false,
					key:      "fruit_shop",
				},
			},
		},
		{
			req: requests.Create{
				Kind:     account.Expense,
				Name:     "Transport",
				Color:    "#e5eb34",
				Icon:     icon.BusFront,
				Children: make([]requests.CreateChild, 0, 10),
			},
			archived: false,
			key:      "transport",
			children: []childCreateReq{},
		},
	}
)

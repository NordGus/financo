package categories

var (
/*
	{
		Account: account.Record{
			Kind:        account.ExternalIncome,
			Currency:    currency.EUR,
			Name:        "Paycheck",
			Description: nullable.New("Where the bread comes from"),
			Color:       "#eb8934",
			Icon:        icon.Banknote,
			Capital:     0,
			DynamicData: account.DynamicData{},
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
					Icon:        icon.BicepsFlexed,
					Capital:     0,
					DynamicData: account.DynamicData{},
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
					Icon:        icon.Briefcase,
					Capital:     0,
					DynamicData: account.DynamicData{},
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
					Icon:        icon.GraduationCap,
					Capital:     0,
					DynamicData: account.DynamicData{},
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

		MapKey: "paycheck",
	},

	{
		Account: account.Record{
			Kind:        account.ExternalIncome,
			Currency:    currency.EUR,
			Name:        "Allowance",
			Description: nullable.Type[string]{},
			Color:       "#eb8934",
			Icon:        icon.Coins,
			Capital:     0,
			DynamicData: account.DynamicData{},
		},
		Children: []childAccountSeed{},

		ArchivedAt: func(moment time.Time) nullable.Type[time.Time] {
			return nullable.New(moment.AddDate(0, 0, -1))
		},
		DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
			return nullable.Type[time.Time]{}
		},

		MapKey: "allowance",
	},

	{
		Account: account.Record{
			Kind:        account.ExternalExpense,
			Currency:    currency.EUR,
			Name:        "Market",
			Description: nullable.New("I need to survive"),
			Color:       "#34ebae",
			Icon:        icon.ShoppingBasket,
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
					Icon:        icon.Flower,
					Capital:     0,
					DynamicData: account.DynamicData{},
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
					Icon:        icon.Salad,
					Capital:     0,
					DynamicData: account.DynamicData{},
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
					Icon:        icon.Apple,
					Capital:     0,
					DynamicData: account.DynamicData{},
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

		MapKey: "market",
	},

	{
		Account: account.Record{
			Kind:        account.ExternalExpense,
			Currency:    currency.EUR,
			Name:        "Transport",
			Description: nullable.Type[string]{},
			Color:       "#e5eb34",
			Icon:        icon.BusFront,
			DynamicData: account.DynamicData{},
		},
		Children: []childAccountSeed{},

		ArchivedAt: func(moment time.Time) nullable.Type[time.Time] {
			return nullable.Type[time.Time]{}
		},
		DeletedAt: func(moment time.Time) nullable.Type[time.Time] {
			return nullable.Type[time.Time]{}
		},

		MapKey: "transport",
	},
*/
)

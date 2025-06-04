package filters

import "financo/models/account"

func FilterKinds(kinds []account.Kind) []account.Kind {
	var (
		out      = make([]account.Kind, 0, 7)
		accepted = map[account.Kind]bool{
			account.Capital: true,
			account.Savings: true,
			account.Debt:    true,
			account.Credit:  true,
			account.Income:  true,
			account.Expense: true,
		}
	)

	for i := range kinds {
		if accepted[kinds[i]] {
			out = append(out, kinds[i])
		}
	}

	if len(out) == 0 {
		out = append(
			out,
			account.Capital,
			account.Savings,
			account.Credit,
			account.Debt,
			account.Expense,
			account.Income,
		)
	}

	return out
}

package filters

import (
	"financo/lib/currency"
	"financo/lib/nullable"
	"financo/models/account"
)

type Accounts struct {
	Kinds      []account.Kind
	Archived   nullable.Type[bool]
	Currencies []currency.Type
}

func FilterAccountKinds(kinds []account.Kind) []account.Kind {
	var (
		out      = make([]account.Kind, 0, 7)
		accepted = map[account.Kind]bool{
			account.Capital: true,
			account.Savings: true,
			account.Debt:    true,
			account.Credit:  true,
		}
	)

	for i := range kinds {
		if accepted[kinds[i]] {
			out = append(out, kinds[i])
		}
	}

	if len(out) == 0 {
		out = append(out, account.Capital, account.Savings, account.Credit, account.Debt)
	}

	return out
}

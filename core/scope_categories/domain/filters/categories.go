package filters

import (
	"financo/lib/nullable"
	"financo/models/account"
)

type Categories struct {
	Kinds    []account.Kind
	Archived nullable.Type[bool]
}

func FilterCategoryKinds(kinds []account.Kind) []account.Kind {
	var (
		out      = make([]account.Kind, 0, 7)
		accepted = map[account.Kind]bool{
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
		out = append(out, account.Expense, account.Income)
	}

	return out
}

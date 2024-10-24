package filters

import "financo/models/account"

func FilterKinds(kinds []account.Kind) []account.Kind {
	var (
		out      = make([]account.Kind, 0, 7)
		accepted = map[account.Kind]bool{
			account.CapitalNormal:   true,
			account.CapitalSavings:  true,
			account.DebtPersonal:    true,
			account.DebtLoan:        true,
			account.DebtCredit:      true,
			account.ExternalIncome:  true,
			account.ExternalExpense: true,
		}
	)

	for i := 0; i < len(kinds); i++ {
		if accepted[kinds[i]] {
			out = append(out, kinds[i])
		}
	}

	if len(out) == 0 {
		out = append(
			out,
			account.CapitalNormal,
			account.CapitalSavings,
			account.DebtCredit,
			account.DebtLoan,
			account.DebtPersonal,
			account.ExternalExpense,
			account.ExternalIncome,
		)
	}

	return out
}

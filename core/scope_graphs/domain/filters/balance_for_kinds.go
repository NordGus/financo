package filters

import (
	"financo/lib/nullable"
	"financo/models/account"
	"time"
)

type BalanceForKinds struct {
	Kinds []account.Kind
	From  nullable.Type[time.Time]
	To    nullable.Type[time.Time]
}

func (f *BalanceForKinds) FilteredKinds() []account.Kind {
	kinds := make([]account.Kind, 0, 10)

	for i := 0; i < len(f.Kinds); i++ {
		switch f.Kinds[i] {
		case account.CapitalNormal:
			kinds = append(kinds, f.Kinds[i])
		case account.CapitalSavings:
			kinds = append(kinds, f.Kinds[i])
		case account.DebtCredit:
			kinds = append(kinds, f.Kinds[i])
		case account.DebtLoan:
			kinds = append(kinds, f.Kinds[i])
		case account.DebtPersonal:
			kinds = append(kinds, f.Kinds[i])
		case account.ExternalExpense:
			kinds = append(kinds, f.Kinds[i])
		case account.ExternalIncome:
			kinds = append(kinds, f.Kinds[i])
		default:
			continue
		}
	}

	if len(kinds) <= 0 {
		return []account.Kind{
			account.CapitalNormal,
			account.CapitalSavings,
			account.DebtCredit,
			account.DebtLoan,
			account.DebtPersonal,
			account.ExternalExpense,
			account.ExternalIncome,
		}
	}

	return kinds
}

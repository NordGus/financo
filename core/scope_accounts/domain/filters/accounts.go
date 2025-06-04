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

func FilterAccountCurrency(currencies []currency.Type) []currency.Type {
	var (
		out      = make([]currency.Type, 0, 5)
		accepted = map[currency.Type]bool{
			currency.CAD: true,
			currency.USD: true,
			currency.EUR: true,
			currency.CHF: true,
			currency.GBP: true,
		}
	)

	for i := range currencies {
		if accepted[currencies[i]] {
			out = append(out, currencies[i])
		}
	}

	if len(out) == 0 {
		out = append(out, currency.CAD, currency.USD, currency.EUR, currency.CHF, currency.GBP)
	}

	return out
}

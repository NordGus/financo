package filters

import "financo/lib/currency"

type SavingsGoals struct {
	Currencies []currency.Type
}

func FilterSavingsGoalCurrency(currencies []currency.Type) []currency.Type {
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

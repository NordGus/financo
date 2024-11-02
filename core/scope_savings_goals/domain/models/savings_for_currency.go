package models

import "financo/lib/currency"

type SavingsForCurrency struct {
	Currency currency.Type
	Savings  int64
}

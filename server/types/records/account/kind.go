package account

// Kind represents the kind of account the record represents
type Kind string

const (
	SystemHistoric  Kind = "system_historic"
	CapitalNormal   Kind = "capital_normal"
	CapitalSavings  Kind = "capital_savings"
	DebtPersonal    Kind = "debt_personal"
	DebtLoan        Kind = "debt_loan"
	DebtCredit      Kind = "debt_credit"
	ExternalIncome  Kind = "external_income"
	ExternalExpense Kind = "external_expense"
)

func IsExternal(kind Kind) bool {
	return kind == ExternalIncome || kind == ExternalExpense
}

func IsDebt(kind Kind) bool {
	return kind == DebtLoan || kind == DebtPersonal || kind == DebtCredit
}

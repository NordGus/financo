package account

import (
	"encoding/json"
	"fmt"
	"strings"
)

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

// UnmarshalJSON receives a buffer b, and ensures that the provided value is a
// valid [Kind]. So [Kind] satisfies the [json.Unmarshaler] interface.
//
// It returns an error if the buffer can't be unmarshal into an string or the
// provided value is not a valid [Kind].
func (k *Kind) UnmarshalJSON(b []byte) error {
	var s string

	if err := json.Unmarshal(b, &s); err != nil {
		return err
	}

	switch strings.ToLower(s) {
	default:
		return fmt.Errorf("account: invalid account kind \"%s\"", s)
	case "system_historic":
		*k = SystemHistoric
	case "capital_normal":
		*k = CapitalNormal
	case "capital_savings":
		*k = CapitalSavings
	case "debt_personal":
		*k = DebtPersonal
	case "debt_loan":
		*k = DebtLoan
	case "debt_credit":
		*k = DebtCredit
	case "external_income":
		*k = ExternalIncome
	case "external_expense":
		*k = ExternalExpense
	}

	return nil
}

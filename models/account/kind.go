package account

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
)

// Kind represents the kind of account the record represents
type Kind string

const (
	History Kind = "history"
	Capital Kind = "capital"
	Savings Kind = "savings"
	Debt    Kind = "debt"
	Credit  Kind = "credit"
	Income  Kind = "income"
	Expense Kind = "expense"
)

func IsExternal(kind Kind) bool {
	return kind == Income || kind == Expense
}

func IsDebt(kind Kind) bool {
	return kind == Debt || kind == Credit
}

func IsCredit(kind Kind) bool {
	return kind == Credit
}

func IsLoan(kind Kind) bool {
	return kind == Debt
}

func IsSavings(kind Kind) bool {
	return kind == Savings
}

func IsCapital(kind Kind) bool {
	return kind == Capital
}

// UnmarshalJSON receives a buffer b, and ensures that the provided value is a
// valid [Kind]. So [Kind] satisfies the [json.Unmarshaler] interface.
//
// It returns an error if the buffer can't be unmarshal into an string or the
// provided value is not a supported [Kind].
func (k *Kind) UnmarshalJSON(b []byte) error {
	var s string

	if err := json.Unmarshal(b, &s); err != nil {
		return err
	}

	switch strings.ToLower(s) {
	default:
		return fmt.Errorf("account: invalid account kind \"%s\"", s)
	case "history":
		*k = History
	case "capital":
		*k = Capital
	case "savings":
		*k = Savings
	case "debt":
		*k = Debt
	case "credit":
		*k = Credit
	case "income":
		*k = Income
	case "expense":
		*k = Expense
	}

	return nil
}

// MarshalJSON returns the json encoding of [Kind]. So [Kind] satisfies the
// [json.Marshaler] interface.
//
// It returns an error if [Kind] is an unsupported value or if json encoding
// fails.
func (k Kind) MarshalJSON() ([]byte, error) {
	var s string

	switch k {
	default:
		return []byte{}, fmt.Errorf("account: invalid account kind \"%s\"", string(k))
	case History:
		s = "history"
	case Capital:
		s = "capital"
	case Savings:
		s = "savings"
	case Debt:
		s = "debt"
	case Credit:
		s = "credit"
	case Income:
		s = "income"
	case Expense:
		s = "expense"
	}

	return json.Marshal(s)
}

// Scan takes the value returned by the SQL database and maps it to [Kind].
// So [Kind] satisfies the [sql.Scanner] interface.
//
// It returns an error if [Kind] is an unsupported value.
func (k *Kind) Scan(value any) error {
	s, ok := value.(string)
	if !ok {
		return errors.New("account: invalid column type")
	}

	switch strings.ToLower(s) {
	default:
		return fmt.Errorf("account: invalid account kind \"%s\"", value)
	case "history":
		*k = History
	case "capital":
		*k = Capital
	case "savings":
		*k = Savings
	case "debt":
		*k = Debt
	case "credit":
		*k = Credit
	case "income":
		*k = Income
	case "expense":
		*k = Expense
	}

	return nil
}

// Value returns the value of [Kind] to be stored in the SQL database. So [Kind]
// satisfies the [driver.Valuer] interface.
//
// It returns an error if [Kind] is an unsupported value.
func (k Kind) Value() (driver.Value, error) {
	var s string

	switch k {
	default:
		return s, fmt.Errorf("account: invalid account kind \"%s\"", string(k))
	case History:
		s = "history"
	case Capital:
		s = "capital"
	case Savings:
		s = "savings"
	case Debt:
		s = "debt"
	case Credit:
		s = "credit"
	case Income:
		s = "income"
	case Expense:
		s = "expense"
	}

	return s, nil
}

// String returns the cast value of [Kind] as a string
func (k Kind) String() string {
	return string(k)
}

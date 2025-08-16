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

func IsPassive(kind Kind) bool {
	return kind == Debt || kind == Credit
}

func IsCredit(kind Kind) bool {
	return kind == Credit
}

func IsDebt(kind Kind) bool {
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

	kind, err := NewKind(s)
	if err != nil {
		return err
	}

	*k = kind

	return nil
}

// MarshalJSON returns the json encoding of [Kind]. So [Kind] satisfies the
// [json.Marshaler] interface.
//
// It returns an error if [Kind] is an unsupported value or if json encoding
// fails.
func (k Kind) MarshalJSON() ([]byte, error) {
	s, err := KindToString(k)
	if err != nil {
		return nil, err
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

	kind, err := NewKind(s)
	if err != nil {
		return err
	}

	*k = kind

	return nil
}

// Value returns the value of [Kind] to be stored in the SQL database. So [Kind]
// satisfies the [driver.Valuer] interface.
//
// It returns an error if [Kind] is an unsupported value.
func (k Kind) Value() (driver.Value, error) {
	return KindToString(k)
}

// String returns the cast value of [Kind] as a string
func (k Kind) String() string {
	return string(k)
}

func NewKind(value string) (Kind, error) {
	switch strings.ToLower(value) {
	default:
		return "", fmt.Errorf("account: invalid account kind \"%s\"", value)
	case "history":
		return History, nil
	case "capital":
		return Capital, nil
	case "savings":
		return Savings, nil
	case "debt":
		return Debt, nil
	case "credit":
		return Credit, nil
	case "income":
		return Income, nil
	case "expense":
		return Expense, nil
	}
}

func KindToString(value Kind) (string, error) {
	switch value {
	default:
		return "", fmt.Errorf("account: invalid account kind \"%s\"", string(value))
	case History:
		return "history", nil
	case Capital:
		return "capital", nil
	case Savings:
		return "savings", nil
	case Debt:
		return "debt", nil
	case Credit:
		return "credit", nil
	case Income:
		return "income", nil
	case Expense:
		return "expense", nil
	}
}

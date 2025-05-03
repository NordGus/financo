package transaction

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
)

type Kind string

const (
	// Income indicates that the transaction represents an income source in the
	// user's finances.
	Income = "income"
	// Expense indicates that the transaction represents an expense in the user's
	// finances.
	Expense = "expense"
	// Transfer indicates that the transaction represents a flow of capital
	// between user's accounts.
	Transfer = "transfer"
)

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
		return fmt.Errorf("transaction: invalid transaction kind \"%s\"", s)
	case "income":
		*k = Income
	case "expense":
		*k = Expense
	case "transfer":
		*k = Transfer
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
		return []byte{}, fmt.Errorf("transaction: invalid transaction kind \"%s\"", string(k))
	case Income:
		s = "income"
	case Expense:
		s = "expense"
	case Transfer:
		s = "transfer"
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
		return errors.New("transaction: invalid column type")
	}

	switch strings.ToLower(s) {
	default:
		return fmt.Errorf("transaction: invalid transaction kind \"%s\"", value)
	case "income":
		*k = Income
	case "expense":
		*k = Expense
	case "transfer":
		*k = Transfer
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
		return s, fmt.Errorf("transaction: invalid transaction kind \"%s\"", string(k))
	case Income:
		s = "income"
	case Expense:
		s = "expense"
	case Transfer:
		s = "transfer"
	}

	return s, nil
}

// String returns the cast value of [Kind] as a string
func (k Kind) String() string {
	return string(k)
}

package currency

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
)

// [ ] TODO: refactor to be able to communicate more data to the frontend

type Type string

type Entry struct {
	Name string `json:"name"`
	Code string `json:"code"`
}

var (
	CAD   Type = "CAD"
	USD   Type = "USD"
	EUR   Type = "EUR"
	CHF   Type = "CHF"
	GBP   Type = "GBP"
	MULTI Type = "MULTI"

	List = []Entry{
		{Name: "Canadian Dollar", Code: "CAD"},
		{Name: "US Dollar", Code: "USD"},
		{Name: "Euro", Code: "EUR"},
		{Name: "Swiss Franc", Code: "CHF"},
		{Name: "Pound Sterling", Code: "GBP"},
	}
)

// New returns the [currency.Type] that matches the value of the given currency
// string.
//
// It returns an error if a match is not found.
func New(currency string) (Type, error) {
	switch strings.ToUpper(currency) {
	default:
		return "", fmt.Errorf("currency: invalid currency \"%s\"", currency)
	case "CAD":
		return CAD, nil
	case "USD":
		return USD, nil
	case "EUR":
		return EUR, nil
	case "CHF":
		return CHF, nil
	case "GBP":
		return GBP, nil
	case "MULTI":
		return MULTI, nil
	}
}

// UnmarshalJSON receives a buffer b, and ensures that the provided value is a
// valid [Type]. So [Type] satisfies the [json.Unmarshaler] interface.
//
// It returns an error if the buffer can't be unmarshal into an string or the
// provided value is not a supported [Type].
func (t *Type) UnmarshalJSON(b []byte) error {
	var s string

	if err := json.Unmarshal(b, &s); err != nil {
		return err
	}

	switch strings.ToUpper(s) {
	default:
		return fmt.Errorf("currency: invalid currency \"%s\"", s)
	case "CAD":
		*t = CAD
	case "USD":
		*t = USD
	case "EUR":
		*t = EUR
	case "CHF":
		*t = CHF
	case "GBP":
		*t = GBP
	case "MULTI":
		*t = MULTI
	}

	return nil
}

// UnmarshalJSON receives a buffer b, and ensures that the provided value is a
// valid [Type]. So [Type] satisfies the [json.Unmarshaler] interface.
//
// It returns an error if the buffer can't be unmarshal into an string or the
// provided value is not a supported [Type].
func (t Type) MarshalJSON() ([]byte, error) {
	var s string

	switch t {
	default:
		return []byte{}, fmt.Errorf("currency: invalid currency \"%s\"", string(t))
	case CAD:
		s = "CAD"
	case USD:
		s = "USD"
	case EUR:
		s = "EUR"
	case CHF:
		s = "CHF"
	case GBP:
		s = "GBP"
	case MULTI:
		s = "MULTI"
	}

	return json.Marshal(s)
}

// Scan takes the value returned by the SQL database and maps it to [Type].
// So [Type] satisfies the [sql.Scanner] interface.
//
// It returns an error if [Type] is an unsupported value.
func (t *Type) Scan(value any) error {
	s, ok := value.(string)
	if !ok {
		return errors.New("currency: invalid column type")
	}

	switch strings.ToUpper(s) {
	default:
		return fmt.Errorf("currency: invalid currency \"%s\"", value)
	case "CAD":
		*t = CAD
	case "USD":
		*t = USD
	case "EUR":
		*t = EUR
	case "CHF":
		*t = CHF
	case "GBP":
		*t = GBP
	case "MULTI":
		*t = MULTI
	}

	return nil
}

// Value returns the value of [Type] to be stored in the SQL database. So [Type]
// satisfies the [driver.Valuer] interface.
//
// It returns an error if [Type] is an unsupported value.
func (t Type) Value() (driver.Value, error) {
	var s string

	switch t {
	default:
		return s, fmt.Errorf("currency: invalid currency \"%s\"", string(t))
	case CAD:
		s = "CAD"
	case USD:
		s = "USD"
	case EUR:
		s = "EUR"
	case CHF:
		s = "CHF"
	case GBP:
		s = "GBP"
	case MULTI:
		s = "MULTI"
	}

	return s, nil
}

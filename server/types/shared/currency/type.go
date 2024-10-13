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
	CAD Type = "CAD"
	USD Type = "USD"
	AUD Type = "AUD"
	EUR Type = "EUR"
	CHF Type = "CHF"
	GBP Type = "GBP"
	RUB Type = "RUB"
	JPY Type = "JPY"
	CNY Type = "CNY"

	List = []Entry{
		{Name: "Canadian Dollar", Code: "CAD"},
		{Name: "US Dollar", Code: "USD"},
		{Name: "Australian Dollar", Code: "AUD"},
		{Name: "Euro", Code: "EUR"},
		{Name: "Swiss Franc", Code: "CHF"},
		{Name: "Pound Sterling", Code: "GBP"},
		{Name: "Russian Ruble", Code: "RUB"},
		{Name: "Japanese Yen", Code: "JPY"},
		{Name: "Chinese Yuan", Code: "CNY"},
	}
)

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
	case "AUD":
		*t = AUD
	case "EUR":
		*t = EUR
	case "CHF":
		*t = CHF
	case "GBP":
		*t = GBP
	case "RUB":
		*t = RUB
	case "JPY":
		*t = JPY
	case "CNY":
		*t = CNY
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
	case AUD:
		s = "AUD"
	case EUR:
		s = "EUR"
	case CHF:
		s = "CHF"
	case GBP:
		s = "GBP"
	case RUB:
		s = "RUB"
	case JPY:
		s = "JPY"
	case CNY:
		s = "CNY"
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
		return errors.New("achievement: invalid column type")
	}

	switch strings.ToUpper(s) {
	default:
		return fmt.Errorf("currency: invalid currency \"%s\"", value)
	case "CAD":
		*t = CAD
	case "USD":
		*t = USD
	case "AUD":
		*t = AUD
	case "EUR":
		*t = EUR
	case "CHF":
		*t = CHF
	case "GBP":
		*t = GBP
	case "RUB":
		*t = RUB
	case "JPY":
		*t = JPY
	case "CNY":
		*t = CNY
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
	case AUD:
		s = "AUD"
	case EUR:
		s = "EUR"
	case CHF:
		s = "CHF"
	case GBP:
		s = "GBP"
	case RUB:
		s = "RUB"
	case JPY:
		s = "JPY"
	case CNY:
		s = "CNY"
	}

	return s, nil
}

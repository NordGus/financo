package currency

import (
	"encoding/json"
	"fmt"
	"strings"
)

// [ ] TODO: refactor to be able to use better constructions

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
func (c *Type) UnmarshalJSON(b []byte) error {
	var s string

	if err := json.Unmarshal(b, &s); err != nil {
		return err
	}

	switch strings.ToUpper(s) {
	default:
		return fmt.Errorf("currency: invalid currency \"%s\"", s)
	case "CAD":
		*c = CAD
	case "USD":
		*c = USD
	case "AUD":
		*c = AUD
	case "EUR":
		*c = EUR
	case "CHF":
		*c = CHF
	case "GBP":
		*c = GBP
	case "RUB":
		*c = RUB
	case "JPY":
		*c = JPY
	case "CNY":
		*c = CNY
	}

	return nil
}

// MarshalJSON returns the json encoding of [Type]. So [Type] satisfies the
// [json.Marshaler] interface.
//
// It returns an error if [Type] is an unsupported value or if json encoding
// fails.
func (c Type) MarshalJSON() ([]byte, error) {
	var s string

	switch c {
	default:
		return []byte{}, fmt.Errorf("currency: invalid currency \"%s\"", s)
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

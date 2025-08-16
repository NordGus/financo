package params

import (
	"financo/lib/currency"
	"financo/lib/nullable"
	"net/http"
	"strings"
)

func ParseCurrencies(r *http.Request, param string) ([]currency.Type, error) {
	parsed := make([]currency.Type, 0, 7)

	if !r.URL.Query().Has(param) {
		return parsed, nil
	}

	values := strings.SplitSeq(r.URL.Query().Get(param), ",")

	for value := range values {
		if value == "" {
			continue
		}

		c, err := currency.New(value)
		if err != nil {
			return parsed, err
		}

		parsed = append(parsed, c)
	}

	return parsed, nil
}

func ParseCurrency(r *http.Request, param string) (currency.Type, error) {
	value := r.URL.Query().Get(param)

	parsed, err := currency.New(value)
	if err != nil {
		return parsed, err
	}

	return parsed, nil
}

func ParseNullableCurrency(r *http.Request, param string) (nullable.Type[currency.Type], error) {
	var parsed nullable.Type[currency.Type]

	if !r.URL.Query().Has(param) {
		return parsed, nil
	}

	value := r.URL.Query().Get(param)

	c, err := currency.New(value)
	if err != nil {
		return parsed, err
	}

	parsed = nullable.New(c)

	return parsed, nil
}

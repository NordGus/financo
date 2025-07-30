package params

import (
	"financo/lib/currency"
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

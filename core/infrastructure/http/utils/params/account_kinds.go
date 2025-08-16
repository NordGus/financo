package params

import (
	"financo/models/account"
	"net/http"
	"strings"
)

func ParseAccountKind(r *http.Request, param string) ([]account.Kind, error) {
	parsed := make([]account.Kind, 0, 7)

	if !r.URL.Query().Has(param) {
		return parsed, nil
	}

	values := strings.SplitSeq(r.URL.Query().Get(param), ",")

	for value := range values {
		if value == "" {
			continue
		}

		c, err := account.NewKind(value)
		if err != nil {
			return parsed, err
		}

		parsed = append(parsed, c)
	}

	return parsed, nil
}

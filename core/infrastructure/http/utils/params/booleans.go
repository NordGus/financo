package params

import (
	"financo/lib/nullable"
	"net/http"
)

func ParseNullableBoolean(r *http.Request, param string) (nullable.Type[bool], error) {
	var parsed nullable.Type[bool]

	if !r.URL.Query().Has(param) {
		return parsed, nil
	}

	parsed = nullable.New(r.URL.Query().Get(param) == "true")

	return parsed, nil
}

package requests

import (
	"financo/lib/nullable"
)

type Session struct {
	ID nullable.Type[string]
}

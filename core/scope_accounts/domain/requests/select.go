package requests

import (
	"financo/lib/nullable"
	"financo/models/account"
)

type Select struct {
	Kinds    []account.Kind
	Archived nullable.Type[bool]
}

package requests

import (
	"financo/lib/nullable"
	"financo/models/account"
)

type Preview struct {
	Kinds    []account.Kind
	Archived nullable.Type[bool]
}

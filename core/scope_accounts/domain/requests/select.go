package requests

import (
	"financo/core/domain/records/account"
	"financo/lib/nullable"
)

type Select struct {
	Kinds    []account.Kind
	Archived nullable.Type[bool]
}

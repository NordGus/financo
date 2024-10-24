package requests

import (
	"financo/server/types/generic/nullable"
	"financo/server/types/records/account"
)

type Select struct {
	Kinds    []account.Kind
	Archived nullable.Type[bool]
}

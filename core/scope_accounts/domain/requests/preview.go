package requests

import (
	"financo/server/types/generic/nullable"
	"financo/server/types/records/account"
)

type Preview struct {
	Kinds    []account.Kind
	Archived nullable.Type[bool]
}

package requests

import (
	"financo/core/domain/records/account"
	"financo/server/types/generic/nullable"
)

type Select struct {
	Kinds    []account.Kind
	Archived nullable.Type[bool]
}

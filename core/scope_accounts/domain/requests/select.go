package requests

import (
	"financo/core/domain/records/account"
	"financo/core/domain/types/nullable"
)

type Select struct {
	Kinds    []account.Kind
	Archived nullable.Type[bool]
}

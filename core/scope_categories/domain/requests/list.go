package requests

import (
	"financo/lib/nullable"
	"financo/models/account"
)

type List struct {
	Kinds   []account.Kind
	Archive nullable.Type[bool]
}

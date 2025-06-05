package requests

import (
	"financo/lib/currency"
	"financo/lib/nullable"
	"financo/models/account"
)

type List struct {
	Kinds      []account.Kind
	Archive    nullable.Type[bool]
	Currencies []currency.Type
}

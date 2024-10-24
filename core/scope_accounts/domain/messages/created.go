package messages

import (
	"financo/models/account"
)

type Created struct {
	Record account.Record
}

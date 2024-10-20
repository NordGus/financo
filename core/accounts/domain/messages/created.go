package messages

import (
	"financo/server/types/records/account"
)

type Created struct {
	Record account.Record
}

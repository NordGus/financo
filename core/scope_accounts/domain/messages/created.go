package messages

import (
	"financo/core/domain/records/account"
)

type Created struct {
	Record account.Record
}

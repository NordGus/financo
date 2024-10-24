package messages

import (
	"financo/core/domain/records/account"
)

type Deleted struct {
	Record account.Record
}

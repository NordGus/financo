package messages

import (
	"financo/server/types/records/account"
)

type Deleted struct {
	Record account.Record
}

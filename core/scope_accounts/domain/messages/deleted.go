package messages

import (
	"financo/models/account"
)

type Deleted struct {
	Record account.Record
}

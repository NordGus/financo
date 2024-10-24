package message

import (
	"financo/models/transaction"
)

type Created struct {
	Record transaction.Record
}

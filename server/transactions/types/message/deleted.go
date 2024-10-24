package message

import (
	"financo/models/transaction"
)

type Deleted struct {
	ID            int64
	PreviousState transaction.Record
	CurrentState  transaction.Record
}

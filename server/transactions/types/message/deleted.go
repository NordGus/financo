package message

import (
	"financo/server/types/records/transaction"
)

type Deleted struct {
	ID            int64
	PreviousState transaction.Record
	CurrentState  transaction.Record
}

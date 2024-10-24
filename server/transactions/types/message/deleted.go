package message

import (
	"financo/core/domain/records/transaction"
)

type Deleted struct {
	ID            int64
	PreviousState transaction.Record
	CurrentState  transaction.Record
}

package message

import (
	"financo/server/types/records/transaction"
)

type Updated struct {
	ID            int64
	PreviousState transaction.Record
	CurrentState  transaction.Record
}

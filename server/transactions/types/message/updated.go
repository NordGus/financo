package message

import (
	"financo/models/transaction"
)

type Updated struct {
	ID            int64
	PreviousState transaction.Record
	CurrentState  transaction.Record
}

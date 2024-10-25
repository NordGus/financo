package messages

import "financo/models/transaction"

type Updated struct {
	Previous transaction.Record
	Current  transaction.Record
}

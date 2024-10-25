package messages

import "financo/models/transaction"

type Deleted struct {
	Record transaction.Record
}

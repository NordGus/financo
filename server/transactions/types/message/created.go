package message

import (
	"financo/server/types/records/transaction"
)

type Created struct {
	Record transaction.Record
}

package message

import (
	"financo/core/domain/records/transaction"
)

type Created struct {
	Record transaction.Record
}

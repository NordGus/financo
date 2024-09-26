package message

import "financo/server/types/records/account"

type Deleted struct {
	ID            int64
	PreviousState account.Record
	CurrentState  account.Record
}

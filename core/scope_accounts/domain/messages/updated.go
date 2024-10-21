package messages

import (
	"financo/server/types/records/account"
)

type Updated struct {
	Previous account.Record
	Current  account.Record
}

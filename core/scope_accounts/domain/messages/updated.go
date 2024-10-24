package messages

import (
	"financo/core/domain/records/account"
)

type Updated struct {
	Previous account.Record
	Current  account.Record
}

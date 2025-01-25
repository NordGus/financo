package messages

import (
	"financo/models/account"
)

type Updated struct {
	Previous account.Record
	Current  account.Record
}

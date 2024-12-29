package brokers

import (
	"financo/core/scope_accounts/domain/messages"
	"financo/lib/message_bus"
)

type Unarchived interface {
	Subscribe(consumer message_bus.Consumer[messages.Unarchived]) error
	Publish(message messages.Unarchived) error
}

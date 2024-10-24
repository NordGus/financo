package brokers

import (
	"financo/core/scope_accounts/domain/messages"
	"financo/lib/message_bus"
)

type DeletedBroker interface {
	Subscribe(consumer message_bus.Consumer[messages.Deleted]) error
	Publish(message messages.Deleted) error
}

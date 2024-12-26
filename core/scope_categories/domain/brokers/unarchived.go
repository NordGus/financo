package brokers

import (
	"financo/core/scope_categories/domain/messages"
	"financo/lib/message_bus"
)

type UnarchivedBroker interface {
	Subscribe(consumer message_bus.Consumer[messages.Unarchived]) error
	Publish(message messages.Unarchived) error
}

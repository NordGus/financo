package brokers

import (
	"financo/core/scope_categories/domain/messages"
	"financo/lib/message_bus"
)

type ArchivedBroker interface {
	Subscribe(consumer message_bus.Consumer[messages.Archived]) error
	Publish(message messages.Archived) error
}

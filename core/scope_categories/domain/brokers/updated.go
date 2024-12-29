package brokers

import (
	"financo/core/scope_categories/domain/messages"
	"financo/lib/message_bus"
)

type Updated interface {
	Subscribe(consumer message_bus.Consumer[messages.Updated]) error
	Publish(message messages.Updated) error
}

package brokers

import (
	"financo/core/scope_categories/domain/messages"
	"financo/lib/message_bus"
)

type Created interface {
	Subscribe(consumer message_bus.Consumer[messages.Created]) error
	Publish(message messages.Created) error
}

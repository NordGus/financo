package brokers

import (
	"financo/core/scope_transactions/domain/messages"
	"financo/lib/message_bus"
)

type UpdatedBroker interface {
	Subscribe(consumer message_bus.Consumer[messages.Updated]) error
	Publish(message messages.Updated) error
}

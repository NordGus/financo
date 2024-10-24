package brokers

import (
	"financo/core/scope_accounts/domain/messages"
	"financo/server/types/message_bus"
)

type UpdatedBroker interface {
	Subscribe(consumer message_bus.Consumer[messages.Updated]) error
	Publish(message messages.Updated) error
}

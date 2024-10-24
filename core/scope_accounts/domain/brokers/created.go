package brokers

import (
	"financo/core/scope_accounts/domain/messages"
	"financo/server/types/message_bus"
)

type CreatedBroker interface {
	Subscribe(consumer message_bus.Consumer[messages.Created]) error
	Publish(message messages.Created) error
}

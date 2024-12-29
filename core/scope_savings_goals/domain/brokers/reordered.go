package brokers

import (
	"financo/core/scope_savings_goals/domain/messages"
	"financo/lib/message_bus"
)

type Reordered interface {
	Subscribe(consumer message_bus.Consumer[messages.Reordered]) error
	Publish(message messages.Reordered) error
}

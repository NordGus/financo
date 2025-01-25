package brokers

import (
	"financo/core/scope_savings_goals/domain/messages"
	"financo/lib/message_bus"
)

type MarkedAsAchieved interface {
	Subscribe(consumer message_bus.Consumer[messages.MarkedAsAchieved]) error
	Publish(message messages.MarkedAsAchieved) error
}

package event_handlers

type EventHandler[Event any] interface {
	Handle(message Event) error
}

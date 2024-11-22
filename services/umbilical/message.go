package umbilical

type Message interface {
	MessageKind() string
}

package brokers

type Handler interface {
	CreatedBroker() CreatedBroker
	DeletedBroker() DeletedBroker
	UpdatedBroker() UpdatedBroker
	Shutdown() error
}

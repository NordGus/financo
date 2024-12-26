package brokers

type Handler interface {
	CreatedBroker() CreatedBroker
	DeletedBroker() DeletedBroker
	UpdatedBroker() UpdatedBroker
	ArchivedBroker() ArchivedBroker
	UnarchivedBroker() UnarchivedBroker
	Shutdown() error
}

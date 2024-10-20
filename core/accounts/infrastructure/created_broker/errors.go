package created_broker

import "errors"

var (
	ErrUninitializedBroker = errors.New("created_broker: broker was not initialized")
)

package services

type MessageBuses interface {
	// Health returns a map of health status information.
	// The keys and values in the map are service-specific.
	//
	// It can panic and terminate the program.
	Health() map[string]string

	// Close terminates the connection to the message buses.
	// It returns an error if the connection cannot be closed.
	Close() error
}

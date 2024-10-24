package services

import (
	"context"
	"database/sql"
)

type SQLDatabaseService interface {
	// Health returns a map of health status information.
	// The keys and values in the map are service-specific.
	//
	// It can panic and terminate the program.
	Health() map[string]string

	// Close terminates the database connection.
	// It returns an error if the connection cannot be closed.
	Close() error

	// Conn returns a new connection to the database.
	// It returns an error if a connection can't be acquire.
	//
	// Every Conn must be returned to the database pool after use by calling [Conn.Close].
	Conn(ctx context.Context) (*sql.Conn, error)
}

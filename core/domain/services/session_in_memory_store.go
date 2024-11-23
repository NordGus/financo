package services

import (
	"context"
	"financo/models/session"
)

type SessionStoreService interface {
	// Health returns a map of health status information.
	// The keys and values in the map are service-specific.
	//
	// It can panic and terminate the program.
	Health() map[string]string

	// Get returns the [session.Record] associated with the given ID.
	// It returns an error if it doesn't finds it.
	Get(ctx context.Context, id string) (session.Record, error)

	// Delete removes the [session.Record] associated with the given ID from the
	// the store.
	// It returns an error if it can't remove it.
	Delete(ctx context.Context, id string) error

	// Save persists the given [session.Record] into the store. It returns an
	// error if it fails to do so.
	Save(ctx context.Context, record session.Record) error

	// Close terminates the connection to the store.
	// It returns an error if the connection cannot be closed.
	Close() error
}

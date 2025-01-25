package services

import "financo/core/scope_accounts/domain/brokers"

type MessageBroker interface {
	// Created returns the corresponding message broker.
	Created() brokers.Created

	// Deleted returns the corresponding message broker.
	Deleted() brokers.Deleted

	// Updated returns the corresponding message broker.
	Updated() brokers.Updated

	// Archived returns the corresponding message broker.
	Archived() brokers.Archived

	// Unarchived returns the corresponding message broker.
	Unarchived() brokers.Unarchived

	// Close closes all message brokers connections.
	//
	// It returns an error if something goes wrong.
	Close() error
}

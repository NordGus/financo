package services

import "financo/core/scope_transactions/domain/brokers"

type MessageBroker interface {
	// Created returns the corresponding message broker.
	Created() brokers.Created

	// Deleted returns the corresponding message broker.
	Deleted() brokers.Deleted

	// Updated returns the corresponding message broker.
	Updated() brokers.Updated

	// Close closes all message brokers connections.
	//
	// It returns an error if something goes wrong.
	Close() error
}

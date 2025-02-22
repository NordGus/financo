package services

import (
	core "financo/core/domain/services"
	"financo/core/scope_transactions/domain/brokers"
)

type MessageBroker interface {
	core.MessageBuses

	// Created returns the corresponding message broker.
	Created() brokers.Created

	// Deleted returns the corresponding message broker.
	Deleted() brokers.Deleted

	// Updated returns the corresponding message broker.
	Updated() brokers.Updated
}

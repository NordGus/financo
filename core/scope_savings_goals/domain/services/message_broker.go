package services

import (
	core "financo/core/domain/services"
	"financo/core/scope_savings_goals/domain/brokers"
)

type MessageBroker interface {
	core.MessageBuses

	// Created returns the corresponding message broker.
	Created() brokers.Created

	// Updated returns the corresponding message broker.
	Updated() brokers.Updated

	// Deleted returns the corresponding message broker.
	Deleted() brokers.Deleted

	// MarkedAsAchieved returns the corresponding message broker.
	MarkedAsAchieved() brokers.MarkedAsAchieved

	// Reordered returns the corresponding message broker.
	Reordered() brokers.Reordered
}

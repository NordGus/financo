package message_buses

import (
	"financo/core/domain/services"

	accounts_services "financo/core/scope_accounts/domain/services"
	categories_services "financo/core/scope_categories/domain/services"
	savings_goals_services "financo/core/scope_savings_goals/domain/services"
	transactions_services "financo/core/scope_transactions/domain/services"

	accounts_broker "financo/core/scope_accounts/infrastructure/services/message_broker"
	categories_broker "financo/core/scope_categories/infrastructure/services/message_broker"
	savings_goals_broker "financo/core/scope_savings_goals/infrastructure/services/message_broker"
	transactions_broker "financo/core/scope_transactions/infrastructure/services/message_broker"

	"financo/services/message_buses/accounts"
	"financo/services/message_buses/categories"
	"financo/services/message_buses/savings_goals"

	"errors"
	"log"
	"sync"
)

type service struct {
	shutdown     bool
	accounts     accounts_services.MessageBroker
	categories   categories_services.MessageBroker
	transactions transactions_services.MessageBroker
	savingsGoals savings_goals_services.MessageBroker
}

var (
	ErrAlreadyShutdown = errors.New("message_buses: already shutdown")

	instance *service
)

// Initialize returns an instance of [services.MessageBuses] for financo.
//
// - It will either return the exiting instance or initialize a new one.
//
// - It will panic if it fails to initialize a new instance.
//
// Must be close on program termination by calling Close to free resources.
func Initialize(wg *sync.WaitGroup) services.MessageBuses {
	wg.Add(1)
	defer wg.Done()

	if instance != nil {
		return instance
	}

	instance = &service{
		shutdown:     false,
		accounts:     accounts_broker.Initialize(wg),
		categories:   categories_broker.Initialize(wg),
		transactions: transactions_broker.Initialize(wg),
		savingsGoals: savings_goals_broker.Initialize(wg),
	}

	err := accounts.Subscribe()
	if err != nil {
		_ = instance.Close()
		log.Fatal("message_buses: failed to initialize Service", err)
	}

	err = categories.Subscribe()
	if err != nil {
		_ = instance.Close()
		log.Fatal("message_buses: failed to initialize Service", err)
	}

	err = savings_goals.Subscribe()
	if err != nil {
		_ = instance.Close()
		log.Fatal("message_buses: failed to initialize Service", err)
	}

	return instance
}

// Close terminates all connections to message brokers.
// If the connections are successfully closed, it returns nil.
// If the service is already shutdown, it returns an error.
// If an error occurs while closing the connections, it returns the an error
// wrapping all errors.
func (s *service) Close() error {
	log.Println("Shutting down message buses")

	if s.shutdown {
		return ErrAlreadyShutdown
	}

	return errors.Join(
		s.accounts.Close(),
		s.categories.Close(),
		s.transactions.Close(),
		s.savingsGoals.Close(),
	)
}

// Health checks the health of all connections by pinging the message_buses.
// It returns a map with keys indicating various health statistics.
func (s *service) Health() map[string]string {
	// ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	// defer cancel()

	stats := make(map[string]string)

	if s.shutdown {
		stats["status"] = "down"
		stats["message"] = "message buses down: service shutdown"

		return stats
	}

	stats["status"] = "up"
	stats["message"] = "It's healthy"

	_, err := accounts_broker.Instance()
	if err != nil {
		log.Println("accounts broker is down")
		stats["accounts_broker"] = "It's down"
		stats["message"] = "One or more broker is down"
	}

	_, err = categories_broker.Instance()
	if err != nil {
		log.Println("categories broker is down")
		stats["categories_broker"] = "It's down"
		stats["message"] = "One or more broker is down"
	}

	_, err = transactions_broker.Instance()
	if err != nil {
		log.Println("transactions broker is down")
		stats["transactions_broker"] = "It's down"
		stats["message"] = "One or more broker is down"
	}

	_, err = savings_goals_broker.Instance()
	if err != nil {
		log.Println("savings goals broker is down")
		stats["savings_goals_broker"] = "It's down"
		stats["message"] = "One or more broker is down"
	}

	return stats
}

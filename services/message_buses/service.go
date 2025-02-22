package message_buses

import (
	"financo/core/domain/services"
	"financo/services/shutdown"

	accountsservices "financo/core/scope_accounts/domain/services"
	categoriesservices "financo/core/scope_categories/domain/services"
	savingsgoalsservices "financo/core/scope_savings_goals/domain/services"
	transactionsservices "financo/core/scope_transactions/domain/services"

	accountsbroker "financo/core/scope_accounts/infrastructure/services/message_broker"
	categoriesbroker "financo/core/scope_categories/infrastructure/services/message_broker"
	savingsgoalsbroker "financo/core/scope_savings_goals/infrastructure/services/message_broker"
	transactionsbroker "financo/core/scope_transactions/infrastructure/services/message_broker"

	"financo/services/message_buses/accounts"
	"financo/services/message_buses/categories"
	"financo/services/message_buses/savings_goals"

	"errors"
	"log"
)

type service struct {
	shutdown bool

	accounts     accountsservices.MessageBroker
	categories   categoriesservices.MessageBroker
	transactions transactionsservices.MessageBroker
	savingsGoals savingsgoalsservices.MessageBroker
}

var (
	ErrAlreadyShutdown = errors.New("message_buses: already shutdown")
	ErrInit            = errors.New("message_buses: failed to initialize")

	instance *service
)

// New returns an instance of [services.MessageBuses] for financo.
//
// - It will either return the exiting instance or initialize a new one.
//
// - It will panic if it fails to initialize a new instance.
//
// Must be close on program termination by calling Close to free resources.
func New() services.MessageBuses {
	if instance != nil {
		return instance
	}

	shutdown.AddTask(1)
	defer shutdown.TaskDone()

	instance = &service{
		accounts:     accountsbroker.New(),
		categories:   categoriesbroker.New(),
		transactions: transactionsbroker.New(),
		savingsGoals: savingsgoalsbroker.Initialize(),
	}

	shutdown.Defer(shutdown.Closure{
		Name: "message_buses service",
		Func: func() {
			err := instance.Close()

			if err != nil {
				log.Printf("message_buses: something went wrong while closing, reason: %s\n", err.Error())
			}
		},
	})

	err := accounts.Subscribe()
	if err != nil {
		shutdown.ExitWithErr(1, errors.Join(ErrInit, err))
	}

	err = categories.Subscribe()
	if err != nil {
		shutdown.ExitWithErr(1, errors.Join(ErrInit, err))
	}

	err = savings_goals.Subscribe()
	if err != nil {
		shutdown.ExitWithErr(1, errors.Join(ErrInit, err))
	}

	return instance
}

// Close is here only to comply with [services.MessageBuses].
func (s *service) Close() error {
	if s.shutdown {
		return ErrAlreadyShutdown
	}

	var err error

	if s.accounts != nil {
		err = errors.Join(s.accounts.Close(), err)
	}

	if s.categories != nil {
		err = errors.Join(s.categories.Close(), err)
	}

	if s.transactions != nil {
		err = errors.Join(s.transactions.Close(), err)
	}

	if s.savingsGoals != nil {
		err = errors.Join(s.savingsGoals.Close(), err)
	}

	return err
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

	_, err := accountsbroker.Instance()
	if err != nil {
		log.Println("accounts broker is down")
		stats["accounts_broker"] = "It's down"
		stats["message"] = "One or more broker is down"
	}

	_, err = categoriesbroker.Instance()
	if err != nil {
		log.Println("categories broker is down")
		stats["categories_broker"] = "It's down"
		stats["message"] = "One or more broker is down"
	}

	_, err = transactionsbroker.Instance()
	if err != nil {
		log.Println("transactions broker is down")
		stats["transactions_broker"] = "It's down"
		stats["message"] = "One or more broker is down"
	}

	_, err = savingsgoalsbroker.Instance()
	if err != nil {
		log.Println("savings goals broker is down")
		stats["savings_goals_broker"] = "It's down"
		stats["message"] = "One or more broker is down"
	}

	return stats
}

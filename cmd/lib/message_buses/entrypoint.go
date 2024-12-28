package message_buses

import (
	"financo/cmd/lib/message_buses/accounts"
	"financo/cmd/lib/message_buses/categories"
	"financo/cmd/lib/message_buses/savings_goals"
	accounts_broker "financo/core/scope_accounts/infrastructure/broker_handler"
	categories_broker "financo/core/scope_categories/infrastructure/broker_handler"
	transactions_broker "financo/core/scope_transactions/infrastructure/broker_handler"
	"log"
	"sync"
)

// CancelFunc is a closure function that shutdown all of financo's brokers and
// its message buses.
type CancelFunc func()

// Initialize initializes all financo's message buses and consumers.
//
// It returns a [CancelFunc] to manage shutdown and error in case something goes
// wrong during initialization.
func Initialize(wg *sync.WaitGroup) (CancelFunc, error) {
	wg.Add(1)
	defer wg.Done()

	var (
		accountsBroker     = accounts_broker.Initialize(wg)
		categoriesBroker   = categories_broker.Initialize(wg)
		transactionsBroker = transactions_broker.Initialize(wg)

		cancel = func() {
			if err := accountsBroker.Shutdown(); err != nil {
				log.Printf("failed to shutdown accounts broker: %s\n", err)
			}

			if err := categoriesBroker.Shutdown(); err != nil {
				log.Printf("failed to shutdown categories broker: %s\n", err)
			}

			if err := transactionsBroker.Shutdown(); err != nil {
				log.Printf("failed to shutdown transactions broker: %s\n", err)
			}
		}
	)

	err := accounts.Subscribe()
	if err != nil {
		cancel()
		return cancel, err
	}

	err = categories.Subscribe()
	if err != nil {
		cancel()
		return cancel, err
	}

	err = savings_goals.Subscribe()
	if err != nil {
		cancel()
		return cancel, err
	}

	return cancel, nil
}

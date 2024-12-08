package on_transaction_created

import (
	"financo/core/scope_savings_goals/application/event_handlers/on_transaction_created"
	"financo/core/scope_savings_goals/infrastructure/lock"
	"financo/core/scope_savings_goals/infrastructure/repositories/on_transaction_operated_repository"
	"financo/core/scope_transactions/domain/messages"
	"financo/services/postgresql_database"
	"log"
	"sync"
)

func NewInMemory(wg *sync.WaitGroup, payload messages.Created) {
	defer wg.Done()

	lock.GlobalLock().Lock()
	defer lock.GlobalLock().Unlock()

	err := on_transaction_created.New(
		on_transaction_operated_repository.NewPostgreSQL(postgresql_database.New()),
	).Handle(payload)
	if err != nil {
		log.Println("something went wrong while handling transaction created message.", err)

		return
	}
}

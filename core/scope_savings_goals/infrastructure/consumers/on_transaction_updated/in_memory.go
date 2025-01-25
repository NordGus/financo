package on_transaction_updated

import (
	"financo/core/scope_savings_goals/application/event_handlers/on_transaction_updated"
	"financo/core/scope_savings_goals/infrastructure/lock"
	"financo/core/scope_savings_goals/infrastructure/repositories/on_transaction_operated_repository"
	"financo/core/scope_transactions/domain/messages"
	"financo/services/postgresql_database"
	"log"
	"sync"
)

func NewInMemory(wg *sync.WaitGroup, payload messages.Updated) {
	defer wg.Done()

	lock.GlobalLock().Lock()
	defer lock.GlobalLock().Unlock()

	err := on_transaction_updated.New(
		on_transaction_operated_repository.NewPostgreSQL(postgresql_database.New()),
	).Handle(payload)
	if err != nil {
		log.Println("something went wrong while handling transaction updated message.", err)

		return
	}
}

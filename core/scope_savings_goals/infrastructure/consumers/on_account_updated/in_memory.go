package on_account_updated

import (
	"financo/core/scope_accounts/domain/messages"
	"financo/core/scope_savings_goals/application/event_handlers/on_account_updated"
	"financo/core/scope_savings_goals/infrastructure/lock"
	"financo/core/scope_savings_goals/infrastructure/repositories/on_account_operated_repository"
	"financo/services/postgresql_database"
	"log"
	"sync"
)

func NewInMemory(wg *sync.WaitGroup, payload messages.Updated) {
	defer wg.Done()

	lock.GlobalLock().Lock()
	defer lock.GlobalLock().Unlock()

	err := on_account_updated.New(on_account_operated_repository.NewPostgreSQL(postgresql_database.New())).Handle(payload)
	if err != nil {
		log.Println("something went wrong while handling account updated message.", err)

		return
	}
}

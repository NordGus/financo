package on_account_deleted

import (
	"financo/core/scope_categories/domain/messages"
	"financo/core/scope_savings_goals/application/event_handlers/on_category_deleted"
	"financo/core/scope_savings_goals/infrastructure/lock"
	"financo/core/scope_savings_goals/infrastructure/repositories/on_account_operated_repository"
	"financo/services/postgresql_database"
	"log"
	"sync"
)

func NewInMemory(wg *sync.WaitGroup, payload messages.Deleted) {
	defer wg.Done()

	lock.GlobalLock().Lock()
	defer lock.GlobalLock().Unlock()

	err := on_category_deleted.New(
		on_account_operated_repository.NewPostgreSQL(postgresql_database.New()),
	).Handle(payload)
	if err != nil {
		log.Println("something went wrong while handling account deleted message.", err)

		return
	}
}

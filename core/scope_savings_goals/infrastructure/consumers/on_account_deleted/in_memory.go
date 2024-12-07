package on_account_deleted

import (
	"financo/core/scope_accounts/domain/messages"
	"financo/core/scope_savings_goals/application/event_handlers/on_account_deleted"
	"financo/core/scope_savings_goals/infrastructure/lock"
	"financo/core/scope_savings_goals/infrastructure/repositories/on_account_operated_repository"
	"financo/models/account"
	"financo/services/postgresql_database"
	"log"
	"sync"
)

func NewInMemory(wg *sync.WaitGroup, payload messages.Deleted) {
	defer wg.Done()

	if payload.Record.Kind != account.CapitalSavings {
		return // Only process savings account
	}

	var (
		l  = lock.GlobalLock()
		db = postgresql_database.New()
	)

	l.Lock()
	defer l.Unlock()

	err := on_account_deleted.New(
		on_account_operated_repository.NewPostgreSQL(db),
	).Handle(payload)
	if err != nil {
		log.Println("something went wrong while handling account deleted message.", err)

		return
	}
}

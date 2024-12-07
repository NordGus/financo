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

	var (
		l  = lock.GlobalLock()
		db = postgresql_database.New()
	)

	l.Lock()
	defer l.Unlock()

	err := on_transaction_updated.New(
		on_transaction_operated_repository.NewPostgreSQL(db),
	).Handle(payload)
	if err != nil {
		log.Println("something went wrong while handling transaction updated message.", err)

		return
	}
}

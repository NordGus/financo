package on_transaction_deleted

import (
	"financo/core/scope_savings_goals/application/event_handlers/on_transaction_deleted"
	"financo/core/scope_savings_goals/infrastructure/repositories/on_transaction_operated_repository"
	"financo/core/scope_transactions/domain/messages"
	"financo/services/postgresql_database"
	"log"
	"sync"
)

func NewInMemory(wg *sync.WaitGroup, payload messages.Deleted) {
	defer wg.Done()

	var (
		db = postgresql_database.New()
	)

	err := on_transaction_deleted.New(
		on_transaction_operated_repository.NewPostgreSQL(db),
	).Handle(payload)
	if err != nil {
		log.Println("something went wrong while handling transaction deleted message.", err)

		return
	}
}

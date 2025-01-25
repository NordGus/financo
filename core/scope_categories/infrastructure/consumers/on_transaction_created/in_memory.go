package on_transaction_created

import (
	"financo/core/scope_categories/application/event_handlers/on_transaction_created"
	"financo/core/scope_categories/infrastructure/repositories/categories_repository"
	"financo/core/scope_categories/infrastructure/repositories/transactions_repository"
	"financo/core/scope_categories/infrastructure/repositories/update_dynamic_data_repository"
	"financo/core/scope_transactions/domain/messages"
	"financo/services/postgresql_database"
	"log"
	"sync"
)

func NewInMemory(wg *sync.WaitGroup, payload messages.Created) {
	defer wg.Done()

	var (
		db = postgresql_database.New()

		categoriesRepo   = categories_repository.NewPostgreSQL(db)
		transactionsRepo = transactions_repository.NewPostgreSQL(db)
		repo             = update_dynamic_data_repository.NewPostgreSQL(db)
	)

	err := on_transaction_created.New(categoriesRepo, transactionsRepo, repo).Handle(payload)
	if err != nil {
		log.Println("something went wrong while handling transaction created message.", err)

		return
	}
}

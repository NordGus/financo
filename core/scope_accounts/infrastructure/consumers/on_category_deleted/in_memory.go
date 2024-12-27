package on_category_deleted

import (
	"financo/core/scope_accounts/application/event_handlers/on_category_deleted"
	"financo/core/scope_accounts/infrastructure/repositories/accounts_repository"
	"financo/core/scope_accounts/infrastructure/repositories/transactions_repository"
	"financo/core/scope_accounts/infrastructure/repositories/update_dynamic_data_repository"
	"financo/core/scope_categories/domain/messages"
	"financo/services/postgresql_database"
	"log"
	"sync"
)

func NewInMemory(wg *sync.WaitGroup, payload messages.Deleted) {
	defer wg.Done()

	var (
		db = postgresql_database.New()

		accountsRepo     = accounts_repository.NewPostgreSQL(db)
		transactionsRepo = transactions_repository.NewPostgreSQL(db)
		repo             = update_dynamic_data_repository.NewPostgreSQL(db)
	)

	err := on_category_deleted.New(accountsRepo, transactionsRepo, repo).Handle(payload)
	if err != nil {
		log.Println("something went wrong while handling category deleted message.", err)

		return
	}
}

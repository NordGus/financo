package on_account_created

import (
	"financo/core/scope_accounts/domain/messages"
	"financo/core/scope_savings_goals/application/event_handlers/on_account_created"
	"financo/core/scope_savings_goals/infrastructure/repositories/on_account_created_or_deleted_repository"
	"financo/models/account"
	"financo/services/postgresql_database"
	"log"
	"sync"
)

func NewInMemory(wg *sync.WaitGroup, payload messages.Created) {
	defer wg.Done()

	if payload.Record.Kind != account.CapitalSavings {
		return // Only process savings account
	}

	var (
		db = postgresql_database.New()
	)

	err := on_account_created.New(on_account_created_or_deleted_repository.NewPostgreSQL(db)).Handle(payload)
	if err != nil {
		log.Println("something went wrong while handling account created message.", err)

		return
	}
}
